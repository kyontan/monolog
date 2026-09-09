/**
 * monolog-uploader: image upload endpoint for Decap CMS -> R2.
 *
 * POST /upload (multipart, field "file"):
 *   Authorization: Bearer <github-token>
 *   -> validates the token belongs to ALLOWED_GITHUB_USER via api.github.com
 *   -> stores under YYYY/MM/<sanitized-name> (WP-style), returns { url }
 *
 * Only the owner can upload; everyone can read via the public R2 URL.
 */

interface Env {
	MEDIA: R2Bucket;
	PUBLIC_BASE_URL: string;
	ALLOWED_GITHUB_USER: string;
	ALLOWED_ORIGINS: string;
}

const MAX_BYTES = 20 * 1024 * 1024;

function cors(env: Env, req: Request): Record<string, string> {
	const origin = req.headers.get("Origin") ?? "";
	const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());
	return {
		"Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Authorization, Content-Type",
		"Access-Control-Max-Age": "86400",
	};
}

async function ownerLogin(token: string): Promise<string | null> {
	const res = await fetch("https://api.github.com/user", {
		headers: { Authorization: `Bearer ${token}`, "User-Agent": "monolog-uploader" },
	});
	if (!res.ok) return null;
	const user = (await res.json()) as { login?: string };
	return user.login ?? null;
}

function safeName(name: string): string {
	const base = name.split("/").pop() ?? "upload.bin";
	const clean = base.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-");
	return clean || "upload.bin";
}

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const headers = { "Content-Type": "application/json", ...cors(env, req) };
		if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
		const url = new URL(req.url);
		if (url.pathname === "/") {
			return Response.json({ ok: true }, { headers });
		}

		if (!(await authed(req, env))) {
			return Response.json({ error: "forbidden" }, { status: 403, headers });
		}

		// GET /list?prefix=2026/&limit=100 -> { files: [{ key, url }] }
		if (url.pathname === "/list" && req.method === "GET") {
			const prefix = url.searchParams.get("prefix") ?? undefined;
			const limit = Math.min(
				1000,
				Math.max(1, Number(url.searchParams.get("limit")) || 100),
			);
			const listed = await env.MEDIA.list({ prefix, limit });
			return Response.json(
				{
					files: listed.objects.map((o) => ({
						key: o.key,
						url: `${env.PUBLIC_BASE_URL}/${o.key}`,
					})),
				},
				{ headers },
			);
		}

		if (url.pathname !== "/upload" || req.method !== "POST") {
			return Response.json({ error: "not found" }, { status: 404, headers });
		}

		const form = await req.formData();
		const file = form.get("file");
		if (!(file instanceof File) || file.size === 0) {
			return Response.json({ error: "missing file" }, { status: 400, headers });
		}
		if (file.size > MAX_BYTES) {
			return Response.json({ error: "file too large" }, { status: 413, headers });
		}

		const now = new Date();
		const dir = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
		let key = `${dir}/${safeName(file.name)}`;
		for (let i = 1; i < 10 && (await env.MEDIA.head(key)); i++) {
			key = `${dir}/${safeName(file.name).replace(/(\.[^.]+)?$/, `-${i}$1`)}`;
		}
		await env.MEDIA.put(key, file.stream(), {
			httpMetadata: { contentType: file.type || "application/octet-stream" },
		});
		return Response.json({ url: `${env.PUBLIC_BASE_URL}/${key}` }, { headers });
	},
};

async function authed(req: Request, env: Env): Promise<boolean> {
	const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
	return !!token && ((await ownerLogin(token)) ?? "") === env.ALLOWED_GITHUB_USER;
}
