import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
// import cloudinary from "cloudinary";
import path from "path";

async function getLaunchOptions() {
  return process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
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
  const cloudinary = await import("cloudinary");
  const launchOptions = await getLaunchOptions();
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1080 });
  // go to the target web
  await page.goto(`${companyCareerUrl}#:~:text=${interests}`, {
    waitUntil: "networkidle0",
  });
  const staticDir = path.join(process.cwd(), "public");
  await page.screenshot({ path: `${staticDir}/screenshot.png` });
  const { secure_url } = await cloudinary.v2.uploader.upload(
    `${staticDir}/screenshot.png`,
    { public_id: encodeURIComponent(companyCareerUrl) },
    function callback(error, result) {
      console.log(`cloudinary callback`);
      console.log(result);
      console.error(error);
    }
  );
  return [secure_url, browser];
};
