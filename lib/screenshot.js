const chromium = require("chrome-aws-lambda");
const { getLaunchOptions } = require("./launchOptions");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");

export const screenshotPage = async ({
  interests = "",
  companyCareerUrl = "",
}) => {
  if (!interests || !companyCareerUrl) {
    return;
  }
  const launchOptions = await getLaunchOptions();
  const browser = await chromium.puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1080 });
  // go to the target web
  await page.goto(`${companyCareerUrl}#:~:text=${interests}`, {
    waitUntil: "networkidle0",
  });
  const staticDir = path.join(process.cwd(), "public");
  await page.screenshot({ path: `${staticDir}/screenshot.png` });
  const { secure_url } = await cloudinary.uploader.upload(
    `${staticDir}/screenshot.png`,
    { public_id: encodeURIComponent(companyCareerUrl) },
    function callback(error, result) {
      console.log(`cloudinary callback`);
      console.log(`upload result::`, result);
      console.error(`error::`, error);
    }
  );
  return [secure_url, browser];
};
