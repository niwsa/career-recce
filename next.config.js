// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

module.exports = {
  future: {
    webpack5: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};
