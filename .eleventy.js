module.exports = function (eleventyConfig) {
  // Passthrough — do NOT let Eleventy process these
  eleventyConfig.addPassthroughCopy("src/assets");

  // Ignore deprecated folder completely
  eleventyConfig.ignores.add("deprecated/**");

  return {
    dir: {
      input: "src",
      output: "_out",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
