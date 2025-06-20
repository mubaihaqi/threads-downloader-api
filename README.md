## 📄 README.md

# Threads Downloader API 🚀

A simple serverless API to extract Threads video URLs, covers, captions, and more — deployed on idk, i have no enough money to deploy this on VPS, hope someone will deploy this for me lol

This project provides an API to extract Threads video URLs, cover images, captions, and more. It offers two main approaches:

1.  **`api/threads.js`**: A lightweight serverless function, optimized for platforms like Vercel, using `puppeteer-core`.
2.  **`index.js`**: A full Express.js server, suitable for local development or traditional Node.js hosting, using the full `puppeteer` and attempting to extract more data.

## 📌 Features

- ✅ Extracts video URL from Threads posts.
- ✅ Extracts cover image.
- ✅ Extracts caption and username.
- ✅ **`index.js`** also attempts to fetch profile picture, post time, like count, and comment count (though currently not all are returned in the API response).
- ✅ Two implementation options: Serverless (`api/threads.js`) or Express server (`index.js`).

---

## 📁 Project Structure

```
threads-downloader-api/
├── api/
│   └── threads.js  # Serverless function (Vercel target), uses puppeteer-core
├── index.js        # Express.js server, uses full puppeteer, more data extraction
├── package.json    # Project dependencies
├── .gitignore      # Optional, for ignoring files/folders
└── README.md       # This file
```

---

## 🤔 Understanding `api/threads.js` vs `index.js`

### `api/threads.js`

- **Purpose**: Designed as a serverless function, ideal for platforms like Vercel.
- **Dependencies**: `puppeteer-core` and `@sparticuz/chromium-min` (for smaller deployment size).
- **Data Extracted**: Video URL, Cover URL, Caption, Username (primarily from meta tags).
- **Pros**: Lightweight, optimized for serverless environments.

### `index.js`

- **Purpose**: A full-fledged Express.js server. Suitable for local development, testing, or deployment as a traditional Node.js application.
- **Dependencies**: `express`, `puppeteer` (full version), `node-fetch`.
- **Data Extracted**: Aims for more comprehensive data including Video URL, Cover URL, Caption, Username. Also attempts to grab user's profile picture, post timestamp, like count, and comment count by inspecting page JavaScript variables like `window.__additionalDataLoaded` (though these extra data points are currently commented out in the returned response object).
- **Pros**: Potential to get more data points, easy to run and test locally as a standard server.
- **Cons**: Larger dependency (full Puppeteer).

---

## ⚙️ How to Use

### 1️⃣ Clone & install

```bash
git clone <your-repo-url>
cd threads-downloader-api
npm install
```

---

### 2️⃣ Running the API

#### Option A: Running the Express Server Locally (using `index.js`)

This is recommended for local development and testing the more comprehensive data extraction.

Start the server:

```bash
node index.js
```

_(You might consider adding `"start": "node index.js"` to your `package.json` scripts section to use `npm start`)_

The API will be available at: `http://localhost:3000/api/threads`
Example usage:

```bash
curl "http://localhost:3000/api/threads?url=https://www.threads.net/@example/post/abc123"
```

#### Option B: Deploying/Testing the Serverless Function (using `api/threads.js`)

This function is intended for serverless platforms like Vercel.

**Local Testing with Vercel CLI:**

```bash
npm install -g vercel # If not already installed
vercel dev
```

The API will be available at a local URL provided by `vercel dev`, typically like `http://localhost:3000/api/threads`.

**Deploy to Vercel:**

```bash
npx vercel login
npx vercel
```

✅ Done! Vercel will automatically deploy `api/threads.js` as a serverless function.

---

### 3️⃣ API Usage

Send a GET request:

**Endpoint (if deployed to Vercel using `api/threads.js`):**
`GET https://<your-vercel-project>.vercel.app/api/threads?url=<threads-post-url>`

**Endpoint (if running locally using `index.js`):**
`GET http://localhost:3000/api/threads?url=<threads-post-url>`

Example:

```bash
curl "https://your-project.vercel.app/api/threads?url=https://www.threads.net/@example/post/abc123"
```

Response:

```json
{
"videoUrl": "...",
"coverUrl": "...",
"caption": "...",
"username": "..."
}

---

## ⚡️ Tech Stack

- [puppeteer-core](https://www.npmjs.com/package/puppeteer-core)
- [@sparticuz/chromium-min](https://www.npmjs.com/package/@sparticuz/chromium-min)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions/)

---

## 📝 License

MIT — feel free to fork, adapt & deploy!

---

Happy building... Adios..! 🚀✨`
```
