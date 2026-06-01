module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("companiesByPageOrder", (companies) => {
    const list = [];
    for (const sector of companies.sectors) {
      for (const company of sector.companies) {
        list.push(company);
      }
    }
    return list.sort((a, b) => (a.pageOrder ?? 999) - (b.pageOrder ?? 999));
  });

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
