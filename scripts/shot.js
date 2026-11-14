const puppeteer = require("puppeteer-core");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new",
    args: [
      "--no-sandbox",
      // Software WebGL, so the radar background actually renders in headless.
      "--enable-unsafe-swiftshader",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--ignore-gpu-blocklist",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 800));

  // Trigger scroll reveals section by section.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });
  await page.screenshot({ path: "screenshots/desktop-full.png", fullPage: true });

  const audit = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
    };
    const overflow = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 10)
      .map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 90), right: Math.round(el.getBoundingClientRect().right) }));
    return {
      docWidth: document.documentElement.scrollWidth,
      sections: [...document.querySelectorAll("main > section")].map((s) => ({ id: s.id, ...rect(s) })),
      headings: [...document.querySelectorAll("h1,h2")].map((h) => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 40), ...rect(h) })),
      header: rect(document.querySelector("header")),
      footer: rect(document.querySelector("footer")),
      overflow,
    };
  });
  fs.writeFileSync("screenshots/audit.json", JSON.stringify(audit, null, 2));

  // Section screenshots for closer review.
  const targets = ["#top", "#main"];
  for (const sel of targets) {
    const el = await page.$(sel);
    if (!el) continue;
    await el.screenshot({ path: `screenshots/${sel.replace("#", "")}.png` });
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
  await page.screenshot({ path: "screenshots/mobile-full.png", fullPage: true });

  const mobileAudit = await page.evaluate(() => ({
    docWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 10)
      .map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 100), right: Math.round(el.getBoundingClientRect().right) })),
  }));
  fs.writeFileSync("screenshots/mobile-audit.json", JSON.stringify(mobileAudit, null, 2));

  await browser.close();
  console.log("done");
})();
