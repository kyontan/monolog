// Provider embed markup (no network at build; official client-side renderers).
// Applied to single entry pages only; list pages keep plain links.
function tweetId(url) {
  const m = url.match(/(?:twitter\.com|x\.com)\/\w+\/status(?:es)?\/(\d+)/);
  return m && m[1];
}

function youtubeId(url) {
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m && m[1];
}

function instagramPermalink(url) {
  const m = url.match(/instagram\.com\/(p|reel|reels)\/([\w-]+)/);
  return m && `https://www.instagram.com/${m[1]}/${m[2]}/`;
}

function speakerdeckId(url) {
  const m = url.match(/speakerdeck\.com\/([\w-]+)/);
  return m && m[1];
}

function embedFor(url, scripts) {
  const clean = url.split("#")[0];
  let id;
  if ((id = tweetId(clean))) {
    scripts.add("twitter");
    return `<blockquote class="twitter-tweet"><a href="https://twitter.com/i/status/${id}"></a></blockquote>`;
  }
  if (instagramPermalink(clean)) {
    scripts.add("instagram");
    return (
      `<blockquote class="instagram-media" data-instgrm-permalink="${instagramPermalink(clean)}" ` +
      `data-instgrm-version="14"></blockquote>`
    );
  }
  if ((id = youtubeId(clean))) {
    return (
      `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${id}" ` +
      `frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
      `allowfullscreen loading="lazy"></iframe>`
    );
  }
  if ((id = speakerdeckId(clean))) {
    return `<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/${id}" ` +
      `allowfullscreen="true" style="border:0;width:100%;aspect-ratio:16/9;" loading="lazy"></iframe>`;
  }
  return null;
}

// Replace paragraphs consisting of a single bare provider link with embeds.
function oembed(html) {
  const scripts = new Set();
  const body = String(html || "").replace(
    /<p>(?:<a[^>]*href="([^"]+)"[^>]*>[^<]*<\/a>|(https?:\/\/[^\s<]+))<\/p>/g,
    (match, href, bare) => embedFor(href || bare, scripts) || match,
  );
  let extra = "";
  if (scripts.has("twitter")) {
    extra += `<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  }
  if (scripts.has("instagram")) {
    extra += `<script async src="https://www.instagram.com/embed.js"></script>`;
  }
  return body + extra;
}

module.exports = { oembed, embedFor };
