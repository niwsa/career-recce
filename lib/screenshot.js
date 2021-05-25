const FormData = require("form-data");
const { request } = require("https");
const crypto = require("crypto");
const utf8_encode = require("./utf8_encode");
const chromium = require("chrome-aws-lambda");
const { getLaunchOptions } = require("./launchOptions");

function computeHash(input) {
  let hash = crypto.createHash("sha1");
  hash.update(utf8_encode(input), "binary");
  return hash.digest("hex");
}

function makeRequest(formData) {
  return new Promise((resolve) => {
    const req = request(
      process.env.CLOUDINARY_UPLOAD_API,
      {
        method: "POST",
        headers: formData.getHeaders(),
      },
      (response) => {
        const { statusCode } = response;
        console.log(statusCode); // 200
        let buffer = "";
        response.on("data", (chunk) => {
          buffer += chunk;
        });
        response.on("end", () => {
          // const data = Buffer.concat(chunks).toString();
          const result = JSON.parse(buffer);
          if (statusCode >= 400) {
            console.error(
              "\x1b[31m%s\x1b[0m",
              "Upload error ⚠️ " + JSON.stringify(result)
            );
          } else {
            resolve(result);
          }
        });
      }
    ).on("error", (err) => {
      console.error(
        "\x1b[31m%s %s\x1b[0m",
        "req error",
        err.message,
        err.stack
      );
    });
    formData.pipe(req);
  });
}

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
    waitUntil: ["load", "networkidle0"],
  });
  const screenShotBuffer = await page.screenshot({ encoding: "binary" });
  const ts = Math.round(new Date().getTime() / 1000);
  const public_id = encodeURIComponent(companyCareerUrl);
  // building formData
  const formData = new FormData();
  formData.append("file", screenShotBuffer, { filename: "screenshot.png" });
  formData.append("api_key", process.env.CLOUDINARY_API_KEY);
  formData.append("public_id", public_id);
  formData.append("timestamp", ts);
  formData.append(
    "signature",
    computeHash(
      `public_id=${public_id}&timestamp=${ts}${process.env.CLOUDINARY_API_SECRET}`
    )
  );

  const { secure_url } = await makeRequest(formData);
  console.log(`🖥 ➡️`, secure_url);
  await browser.close();
  return secure_url;
};
