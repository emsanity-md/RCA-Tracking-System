const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new",
    args: [
      "--no-sandbox",
      "--enable-unsafe-swiftshader",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--ignore-gpu-blocklist",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));

  const readState = () =>
    page.evaluate(() => {
      const panel = document.querySelector("#record");
      const buttons = [...panel.querySelectorAll("button")].map((b) => ({
        label: b.textContent.trim(),
        pressed: b.getAttribute("aria-pressed"),
      }));
      const text = panel.textContent.replace(/\s+/g, " ");
      return {
        buttons,
        hasPlcLog: text.includes("plc-event-88213"),
        hasInterlock: text.includes("lane enable dropped on restart"),
        rootCause: text.match(/Root cause statement ([^C]+?)EVIDENCE/i)?.[1]?.trim(),
      };
    });

  console.log("BEFORE:", JSON.stringify(await readState(), null, 2));

  await page.click('#record button:nth-of-type(2)');
  await new Promise((r) => setTimeout(r, 400));
  console.log("AFTER :", JSON.stringify(await readState(), null, 2));

  // Anchor targets resolve and scroll.
  const anchors = await page.evaluate(() =>
    ["#record", "#closed-record"].map((sel) => {
      const el = document.querySelector(sel);
      return { sel, exists: !!el, top: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null };
    }),
  );
  console.log("ANCHORS:", JSON.stringify(anchors));

  const ctas = await page.evaluate(() =>
    [...document.querySelectorAll("a[href^='#']")].map((a) => ({
      label: a.textContent.trim(),
      href: a.getAttribute("href"),
    })),
  );
  console.log("CTAS:", JSON.stringify(ctas));

  await browser.close();
})();
