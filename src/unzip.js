const fs = require("fs");
const unzipper = require("unzipper");

(function main() {
  fs.createReadStream("download/moses.zip").pipe(
    unzipper.Extract({ path: "html/moses" })
  );
  fs.createReadStream("download/history.zip").pipe(
    unzipper.Extract({ path: "html/history" })
  );
  fs.createReadStream("download/poetry.zip").pipe(
    unzipper.Extract({ path: "html/poetry" })
  );
  fs.createReadStream("download/prophets.zip").pipe(
    unzipper.Extract({ path: "html/prophets" })
  );
  fs.createReadStream("download/newtest.zip").pipe(
    unzipper.Extract({ path: "html/newtest" })
  );

  console.log("unzipping completed");
})();
