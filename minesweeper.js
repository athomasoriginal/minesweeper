const fs = require('fs');
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const file = __dirname + req.url;

  console.log("Loading File: ", file);

  const files = {
    "/Users/thomas/code/projects/minesweeper/":                  {file: "./public/index.html", type: "text/html"},
    "/Users/thomas/code/projects/minesweeper/src/index.js":      {file: "./src/index.js",      type: "text/javascript"},
    "/Users/thomas/code/projects/minesweeper/public/styles.css": {file: "./public/styles.css", type: "text/css"},
  }

  fs.readFile(files[file].file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
    } else {
      res.writeHead(200, { 'Content-Type': files[file].type });
      res.end(data);
    }
  });
})

server.listen(PORT);
