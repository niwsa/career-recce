const chromium = require("chrome-aws-lambda");
const { getLaunchOptions } = require("./launchOptions");

export const crawl = async ({ interests = "", companyCareerUrl = "" }) => {
  if (!interests || !companyCareerUrl) {
    return;
  }

  const launchOptions = await getLaunchOptions();

  const browser = await chromium.puppeteer.launch(launchOptions);
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
