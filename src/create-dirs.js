const fs = require("fs");

(function main() {
  createDir("download");
  createDir("html");
  createDir("txt");
  console.log("created directories");
})();

function createDir(name) {
  try {
    fs.mkdirSync(`./${name}`);
  } catch (err) {}
}
