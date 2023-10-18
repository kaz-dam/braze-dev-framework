const express = require("express");
const path = require("path");
const fs = require("fs");
const FileWatcher = require("./watcher");

const app = express();
const PORT = 3000;

const watcher = new FileWatcher();
watcher.init();

app.use(express.static(path.join(__dirname, "serve")));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    const directoryPath = path.join(__dirname, "serve");

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send("Failed to read directory");
            return;
        }

        let fileLinks = files
            .filter((file) => file.endsWith(".html"))
            .map((file) => `<li><a href="/${file}">${file}</a></li>`)
            .join("");

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
            <title>Rendered HTML Files</title>
            </head>
            <body>
                <h1>Files:</h1>
                <ul>
                    ${fileLinks}
                </ul>
            </body>
            </html>
        `);
    });
});
