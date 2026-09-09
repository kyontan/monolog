/* R2 media library for Decap CMS: uploads/browser via monolog-uploader Worker.
 * Registered as `r2` (see static/admin/index.html, config.yml media_library).
 * Auth: reuses the Decap GitHub session token; the Worker admits only the owner.
 */
(function () {
  var ENDPOINT = "";

  function sessionToken() {
    try {
      const raw = window.localStorage.getItem("decap-cms-user");
      if (!raw) return null;
      return JSON.parse(raw).token || null;
    } catch (e) {
      return null;
    }
  }

  async function api(path, token, opts) {
    const res = await fetch(ENDPOINT + path, {
      ...(opts || {}),
      headers: { Authorization: "Bearer " + token, ...(opts && opts.headers) },
    });
    if (!res.ok) throw new Error("r2 api failed: " + res.status);
    return res.json();
  }

  async function uploadOne(token, file) {
    const form = new FormData();
    form.append("file", file, file.name);
    const res = await fetch(ENDPOINT + "/upload", {
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

  function openBrowser(token, onInsert) {
    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;";
    var panel = document.createElement("div");
    panel.style.cssText =
      "background:#fff;max-width:800px;width:90%;max-height:80%;overflow:auto;padding:16px;border-radius:4px;";
    var bar = document.createElement("div");
    bar.style.cssText = "display:flex;gap:8px;align-items:center;";
    var upload = document.createElement("button");
    upload.textContent = "Upload";
    upload.onclick = async () => {
      const files = await pickFiles(true);
      for (const file of files) {
        try {
          onInsert(await uploadOne(token, file));
        } catch (e) {
          alert("Upload failed: " + file.name);
        }
      }
      refresh();
    };
    var close = document.createElement("button");
    close.textContent = "Close";
    close.onclick = () => overlay.remove();
    bar.appendChild(upload);
    bar.appendChild(close);
    var grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin:12px 0;";
    panel.appendChild(bar);
    panel.appendChild(grid);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    function refresh() {
      grid.innerHTML = "";
      api("/list?limit=200", token).then(
        (data) => {
          (data.files || []).reverse().forEach((f) => {
            var img = document.createElement("img");
            img.src = f.url;
            img.title = f.key;
            img.style.cssText = "width:100%;height:100px;object-fit:cover;cursor:pointer;";
            img.onclick = () => {
              onInsert(f.url);
              overlay.remove();
            };
            grid.appendChild(img);
          });
          if (!grid.children.length) grid.textContent = "No images yet. Upload from the editor.";
        },
        () => {
          grid.textContent = "Failed to list images.";
        },
      );
    }
    refresh();
  }

  async function init({ options = {}, handleInsert } = {}) {
    // config.yml media_library.config.endpoint (uploadcare-style nesting).
    ENDPOINT = (((options || {}).config || {}).endpoint || options.endpoint || "").replace(/\/+$/, "");
    if (!ENDPOINT) throw new Error("r2 media library: options.endpoint is required");
    return {
      show: async () => {
        const token = sessionToken();
        if (!token) throw new Error("Not logged in (no GitHub session)");
        openBrowser(token, handleInsert);
      },
      enableStandalone: () => true,
    };
  }

  window.R2MediaLibrary = { name: "r2", init };
})();
