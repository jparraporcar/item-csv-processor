# 📦 Item CSV Processor

Welcome to the Item CSV Processor app. This tool allows you to upload, clean, and enhance product descriptions in CSV format with a few easy steps.

---

## 🚀 Steps to Use the App

### 1. Upload your `item.csv` file

- Drag & drop your `item.csv` into the upload area.
- A preview of your CSV data will appear immediately.

### 2. Clean Descriptions

- Click **“Clean Descriptions”** to remove **deprecated `<font>` tags**.
- Each `<font>` tag is replaced with a `<span>` that preserves styles like `color`, `size`, etc.
- The preview updates to reflect the cleaned HTML output.

### 3. Insert SEO Keywords

- Click **“Insert SEO Keywords”** to inject keywords into descriptions:
  - **First keyword** is prepended in a `<span>` (e.g., `[Summer Sale] Product description…`)
  - A footer `<div>` is appended: `🔍 Popular: Keyword2, Keyword3`
- These keywords are useful for boosting product visibility.

### 4. Export the Result

- Click **“Export Result”** to download your updated CSV.
- The new file includes all cleaned and keyword-enhanced descriptions.

---

## 🧑‍💻 Additional Feature

### 🧪 Run the Puppeteer Script

You can run a test automation flow to:

1. Connect to a headless browser via Browserless.io
2. Log in to a mock login page (Herokuapp)
3. Capture a screenshot
4. Return the image for frontend preview

Use this to verify that your automation infrastructure is working properly.

---

## 🔧 Configuration

To use Puppeteer with Browserless, create a `.env.local` file in your project root:

```env
BROWSERLESS_ENDPOINT=wss://production-sfo.browserless.io?token=YOUR_API_TOKEN_HERE

```
