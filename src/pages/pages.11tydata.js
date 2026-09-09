module.exports = {
  layout: "page.njk",
  eleventyComputed: {
    permalink: (data) => `/pages/${data.slug || data.page.fileSlug}/`,
  },
};
