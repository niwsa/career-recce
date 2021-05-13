const chromium = require("chrome-aws-lambda");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");

async function getLaunchOptions() {
  return process.env.AWS_REGION
    ? {
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      }
    : {
        // args: [],
        headless: true,
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : process.platform === "darwin"
            ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" // because we are using puppeteer-core so we must define this option
            : "",
      };
}

export const crawl = async ({ interests = "", companyCareerUrl = "" }) => {
  if (!interests || !companyCareerUrl) {
    return;
  }

  const launchOptions = await getLaunchOptions();

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // go to the target web
  await page.goto(companyCareerUrl, {
    waitUntil: "networkidle0",
  });

  // Extract results from page
  const posts = await page.$x(`//*[contains(text(),'${interests}')]`);
  // for (const post of posts) {
  //   const valueHandle = await post.getProperty("innerText");
  //   console.log(await valueHandle.jsonValue());
  // }
  //   await page.pdf({ path: "remotejobs.pdf" });

  // close the browser

  return [posts, browser];
};

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
