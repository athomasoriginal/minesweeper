const fs = require('fs');
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const file_path = __dirname + req.url;
  const file = file_path.split("/").pop();

  console.log("Loading File: ", file);

  const files = {
    "":           {file: "./public/index.html", type: "text/html"},
    "index.js":   {file: "./src/index.js",      type: "text/javascript"},
    "styles.css": {file: "./public/styles.css", type: "text/css"},
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
