import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
      let videoUrl = null;
      let caption = "";
      let username = "";
      let coverUrl = "";

      const videoTag = document.querySelector("video");
      if (videoTag) videoUrl = videoTag.src;

      const metaDesc = document.querySelector(
        'meta[property="og:description"]'
      );
      if (metaDesc) caption = metaDesc.content;

      const metaTitle = document.querySelector('meta[property="og:title"]');
      if (metaTitle) username = metaTitle.content;

      const metaImage = document.querySelector('meta[property="og:image"]');
      if (metaImage) coverUrl = metaImage.content;

      return {
        videoUrl,
        coverUrl,
        caption,
        username,
      };
    });

    await browser.close();
    if (data.videoUrl) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Video URL not found" });
    }
  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    res.status(500).json({ error: "Server error" });
  }
}
