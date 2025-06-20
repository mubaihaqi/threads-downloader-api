import express from "express";
import fetch from "node-fetch";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

async function extractThreadsData(threadsUrl) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(threadsUrl, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    let videoUrl = null;
    let caption = "";
    let username = "";
    let profilePicUrl = "";
    let postedAt = "";
    let likeCount = 0;
    let commentCount = 0;
    let coverUrl = "";

    // Fallbacks
    const videoTag = document.querySelector("video");
    if (videoTag) videoUrl = videoTag.src;

    const metaDesc = document.querySelector('meta[property="og:description"]');
    if (metaDesc) caption = metaDesc.content;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) username = metaTitle.content;

    const metaImage = document.querySelector('meta[property="og:image"]');
    if (metaImage) coverUrl = metaImage.content;

    // Try JSON
    if (window.__additionalDataLoaded) {
      const keys = Object.keys(window.__additionalDataLoaded);
      keys.forEach((k) => {
        const d = window.__additionalDataLoaded[k];
        if (d?.data?.data?.media) {
          const raw = d.data.data.media;

          if (raw.video_versions?.length) {
            videoUrl = raw.video_versions[0].url;
          }

          caption = raw.caption?.text || caption;
          username = raw.user?.username || username;
          profilePicUrl = raw.user?.profile_pic_url || "";

          if (raw.taken_at) {
            postedAt = new Date(raw.taken_at * 1000).toISOString();
          }

          likeCount = raw.like_count || 0;
          commentCount = raw.comment_count || 0;

          coverUrl = raw.thumbnail_url || raw.display_url || coverUrl;
        }
      });
    }

    return {
      videoUrl,
      coverUrl,
      caption,
      username,
      //   profilePicUrl,
      //   postedAt,
      //   likeCount,
      //   commentCount,
    };
  });

  await browser.close();
  return data;
}

// Test route
app.get("/", (req, res) => {
  res.send("Hello! Threads Downloader API is working!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// API endpoint to get Threads video URL
app.get("/api/threads", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const data = await extractThreadsData(url);

    if (data.videoUrl) {
      res.json(data);
    } else {
      res.status(404).json({ error: "Video URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
