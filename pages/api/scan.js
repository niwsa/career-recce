import { screenshotPage } from "lib/screenshot";

export default async function handler(req, res) {
  const { query, url } = req.query;
  console.log(`generating screenshot for 🕸`, url);
  console.table({ query, url });
  const imageUrl = await screenshotPage({
    interests: query,
    companyCareerUrl: url,
  });
  res.status(200).json({ scrShot: imageUrl });
}
