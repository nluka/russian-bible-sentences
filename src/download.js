const fs = require("fs");
const http = require("http");
const https = require("https");

(async function main() {
  await download(
    "http://www.russianbible.net/downloads/moses.zip",
    "download/moses.zip"
  );
  await download(
    "http://www.russianbible.net/downloads/history.zip",
    "download/history.zip"
  );
  await download(
    "http://www.russianbible.net/downloads/poetry.zip",
    "download/poetry.zip"
  );
  await download(
    "http://www.russianbible.net/downloads/prophets.zip",
    "download/prophets.zip"
  );
  await download(
    "http://www.russianbible.net/downloads/newtest.zip",
    "download/newtest.zip"
  );

  console.log("downloads completed");
})();

// https://stackoverflow.com/a/62056725/16471560
async function download(url, filePath) {
  const proto = !url.charAt(4).localeCompare("s") ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        });
        return;
      }

      fileInfo = {
        mime: response.headers["content-type"],
        size: parseInt(response.headers["content-length"], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on("finish", () => resolve(fileInfo));

    request.on("error", (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on("error", (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}
