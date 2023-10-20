const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const localDir = process.cwd();

app.use(express.static(path.join(localDir, "serve")));

app.get("/", (req, res) => {
    const directoryPath = path.join(localDir, "serve");

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

module.exports = {
    start: () => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
};
