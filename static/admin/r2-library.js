/* R2 media library for Decap CMS: uploads via monolog-uploader Worker.
 * Registered as `r2` (see static/admin/index.html, config.yml media_library).
 * Auth: reuses the Decap GitHub session token; the Worker admits only the owner.
 */
(function () {
  function sessionToken() {
    try {
      const raw = window.localStorage.getItem("decap-cms-user");
      if (!raw) return null;
      return JSON.parse(raw).token || null;
    } catch (e) {
      return null;
    }
  }

  async function uploadOne(endpoint, token, file) {
    const form = new FormData();
    form.append("file", file, file.name);
    const res = await fetch(endpoint + "/upload", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: form,
    });
    if (!res.ok) throw new Error("upload failed: " + res.status);
    const data = await res.json();
    if (!data.url) throw new Error("bad upload response");
    return data.url;
  }

  function pickFiles(multiple) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = multiple !== false;
      input.onchange = () => resolve(Array.from(input.files || []));
      input.click();
    });
  }

  async function init({ options = {}, handleInsert } = {}) {
    const endpoint = (options.endpoint || "").replace(/\/+$/, "");
    if (!endpoint) throw new Error("r2 media library: options.endpoint is required");
    return {
      show: async ({ allowMultiple } = {}) => {
        const token = sessionToken();
        if (!token) throw new Error("Not logged in (no GitHub session)");
        const files = await pickFiles(allowMultiple);
        if (!files.length) return;
        const urls = [];
        for (const file of files) urls.push(await uploadOne(endpoint, token, file));
        handleInsert(urls.length === 1 ? urls[0] : urls);
      },
      // No standalone browser: uploads happen from the editor only.
      enableStandalone: () => false,
    };
  }

  window.R2MediaLibrary = { name: "r2", init };
})();
