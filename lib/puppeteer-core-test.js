const puppeteer = require("puppeteer-core");

export default async ({
  interests = "Frontend,React",
  companyCareerUrl = "https://vercel.com/careers",
}) => {
  let launchOptions = {
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // because we are using puppeteer-core so we must define this option
  };

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
