const chromium = require("chrome-aws-lambda");

export async function getLaunchOptions() {
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
