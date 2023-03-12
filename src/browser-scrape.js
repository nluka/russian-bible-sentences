/* eslint-disable @typescript-eslint/no-var-requires */

const { writeFileSync, readdirSync } = require("fs");
const puppeteer = require("puppeteer");

(async function main() {
  let historyFiles = readdirSync("./html/history");
  let mosesFiles = readdirSync("./html/moses");
  let newtestFiles = readdirSync("./html/newtest");
  let poetryFiles = readdirSync("./html/poetry/");
  let prophetsFiles = readdirSync("./html/prophets");

  {
    const regex = /[1-9][0-9]*\.html$/;

    historyFiles = historyFiles
      .filter((name) => name.match(regex))
      .map((name) => `history/${name}`);
    mosesFiles = mosesFiles
      .filter((name) => name.match(regex))
      .map((name) => `moses/${name}`);
    newtestFiles = newtestFiles
      .filter((name) => name.match(regex))
      .map((name) => `newtest/${name}`);
    poetryFiles = poetryFiles
      .filter((name) => name.match(regex))
      .map((name) => `poetry/${name}`);
    prophetsFiles = prophetsFiles
      .filter((name) => name.match(regex))
      .map((name) => `prophets/${name}`);
  }

  const allFiles = [
    ...historyFiles,
    ...mosesFiles,
    ...newtestFiles,
    ...poetryFiles,
    ...prophetsFiles,
  ];

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1000,
  });

  for (const file of allFiles) {
    const url = `file://${__dirname}/../html/${file}`;
    await page.goto(url);
    const origin = await getOrigin(page);
    const text = await copyAllText(browser, page, origin);
    processCopiedText(text, origin);
  }

  await browser.close();

  console.log("text scraped");
})();

async function getOrigin(page) {
  const origin = await page.evaluate(() => document.location.href);
  return origin;
}

async function copyAllText(browser, page, origin) {
  await page.keyboard.down("ControlLeft");
  await page.keyboard.press("a");
  await page.keyboard.press("c");
  await page.keyboard.up("ControlLeft");

  // allow ourselves to read from the clipboard
  {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(origin, ["clipboard-read"]);
  }

  const text = await page.evaluate(() => navigator.clipboard.readText());
  return text;
}

function processCopiedText(text, origin) {
  const lines = text.split("\n");
  const goodLines = [];

  for (let i = 1 /* skip first line */; i < lines.length; ++i) {
    const line = lines[i];
    if (line.match(/^[1-9]/)) {
      const goodText = line.replace(/^[0-9]+\t/, "");
      goodLines.push(goodText.slice(0, goodText.length - 1));
    }
  }

  const outFilePathname = `./txt/${origin
    .match(/[0-9a-zA-Z-]+\.html$/)[0]
    .replace(".html", "")}.txt`;

  writeFileSync(outFilePathname, goodLines.join("\n"));
}
