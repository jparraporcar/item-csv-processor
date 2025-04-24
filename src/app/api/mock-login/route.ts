import puppeteer from "puppeteer-core";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔌 Connecting to Browserless...");
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSERLESS_ENDPOINT!, // Set this in .env.local
    });

    const page = await browser.newPage();
    console.log("🌐 Navigating to Herokuapp login...");
    await page.goto("https://the-internet.herokuapp.com/login", {
      waitUntil: "networkidle2",
    });

    console.log("🧑 Typing username...");
    await page.type("#username", "tomsmith");
    console.log("🔐 Typing password...");
    await page.type("#password", "SuperSecretPassword!");

    console.log("🚪 Submitting form...");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    console.log("📸 Capturing screenshot...");
    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();
    console.log("✅ Browser closed.");

    return NextResponse.json({
      status: "ok",
      screenshot: `data:image/png;base64,${screenshot}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Puppeteer error:", msg);
    return NextResponse.json(
      { status: "error", message: msg },
      { status: 500 }
    );
  }
}
