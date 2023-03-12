const {
  readdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
} = require("fs");

(async function main() {
  writeFileSync("sentences.txt", ""); // create|clear file

  const files = readdirSync("./txt");
  for (const file of files) {
    const fullPath = `./txt/${file}`;
    const buffer = readFileSync(fullPath);
    const string = buffer.toString();

    const formatted = string
      .replace(/\n/g, " ") // replace newlines with spaces
      .replace(/['`]/g, '"') // normalize quotations
      .replace(/\^+ ?/g, "") // remove "^" chars
      .replace(/ {2,}/g, " "); // fix multiple spaces

    appendFileSync("sentences.txt", formatted + " ");
  }

  // clean file
  {
    const buffer = readFileSync("sentences.txt");
    const string = buffer.toString();
    let cleaned = string.trim();

    cleaned = cleaned.replace(/[`"']/g, ""); // remove quotations

    cleaned = cleaned.replace(/\([0-9]+-[0-9]+\) /g, ""); // end each sentence with a newline

    cleaned = cleaned.replace(/([.!?]) /g, "$1\n"); // end each sentence with a newline

    cleaned = cleaned.replace(/([а-яА-Я])--([а-яА-Я])/g, "$1-$2");

    cleaned = cleaned.replace(/([ \n])--([а-яА-Я])/g, "$1$2");

    cleaned = cleaned.replace(/\[([а-яА-Я \n]*)\]/g, "$1");

    writeFileSync("sentences.txt", cleaned);
  }

  // remove duplicate lines
  // {
  //   const buffer = readFileSync("sentences.txt");
  //   const string = buffer.toString();
  //   const sentences = string.split("\n");
  //   const set = new Set(sentences);
  //   writeFileSync("sentences.txt", ""); // clear
  //   set.forEach((sentence) => appendFileSync("sentences.txt", sentence + "\n"));
  // }

  // sort lines
  // {
  //   const buffer = readFileSync("sentences.txt");
  //   const string = buffer.toString();
  //   const sentences = string.split("\n");
  //   sentences.sort((a, b) => {
  //     if (a.length < b.length) {
  //       return -1;
  //     } else if (a.length === b.length) {
  //       return a.toLowerCase() - b.toLowerCase();
  //     } else {
  //       return 1;
  //     }
  //   });
  //   writeFileSync("sentences.txt", sentences.join("\n"));
  // }

  console.log("text combination and processing completed");
})();
