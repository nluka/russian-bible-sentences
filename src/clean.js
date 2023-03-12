const fs = require("fs");

(function main() {
  removeDir("download");
  removeDir("html");
  removeDir("txt");
  console.log("removed directories");
})();

function removeDir(name) {
  try {
    fs.rmSync(`./${name}`, { recursive: true, force: true });
  } catch (err) {}
}
