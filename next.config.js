// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

module.exports = {
  future: {
    webpack5: false,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  target: "serverless",
};
