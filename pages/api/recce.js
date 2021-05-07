import run from "lib/puppeteer-core-test";
export default async (req, res) => {
  const [posts, browser] = await run();
  let out = [];
  for (const post of posts) {
    const valueHandle = await post.getProperty("innerText");
    out.push(await valueHandle.jsonValue());
  }
  await browser.close();

  res.status(200).json(out);
};
