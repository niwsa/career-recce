import * as FormData from "form-data";
import { createReadStream } from "fs";
import { request } from "https";
import crypto from "crypto";
import utf8_encode from "./utf8_encode";
const chromium = require("chrome-aws-lambda");
const { getLaunchOptions } = require("./launchOptions");
// const { v2: cloudinary } = require("cloudinary");
const path = require("path");

function computeHash(input) {
  let hash = crypto.createHash("sha1");
  hash.update(utf8_encode(input), "binary");
  return hash.digest("hex");
}

function makeRequest(formData) {
  return new Promise((resolve, reject) => {
    const req = request(
      process.env.CLOUDINARY_UPLOAD_API,
      {
        method: "POST",
        headers: formData.getHeaders(),
      },
      (response) => {
        const { statusCode } = response;
        console.log(statusCode); // 200
        if (statusCode >= 400) {
          reject(new Error(response.statusMessage));
        }
        let buffer = "";
        response.on("data", (chunk) => {
          buffer += chunk;
        });
        response.on("end", () => {
          // const data = Buffer.concat(chunks).toString();
          const result = JSON.parse(buffer);
          resolve(result);
        });
      }
    );
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
    waitUntil: "networkidle0",
  });
  const staticDir = path.join(process.cwd(), "public");
  await page.screenshot({ path: `${staticDir}/screenshot.png` });
  const readStream = createReadStream(`${staticDir}/screenshot.png`);
  const ts = Math.round(new Date().getTime() / 1000);
  const public_id = encodeURIComponent(companyCareerUrl);
  // building formData
  const formData = new FormData();
  formData.append("file", readStream);
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

  // const { secure_url } = await cloudinary.uploader.upload(
  //   `${staticDir}/screenshot.png`,
  //   { public_id: encodeURIComponent(companyCareerUrl) },
  //   function callback(error, result) {
  //     console.log(`cloudinary callback`);
  //     console.log(`upload result::`, result);
  //     console.error(`error::`, error);
  //   }
  // );
  return [secure_url, browser];
};
