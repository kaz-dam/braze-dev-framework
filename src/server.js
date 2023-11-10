const express = require("express");
const path = require("path");
const fs = require("fs");
const Liquid = require("brazejs");
// const browserSync = require("browser-sync");
const getFiles = require("../utils/get-files");
const LiquidContext = require("./liquid-context");
const mirrorFiles = require("../utils/mirror-files");

const engine = new Liquid({
    root: process.cwd(),
    extname: '.liquid'
});

const context = new LiquidContext();
const app = express();
const PORT = 3000;

const localDir = process.cwd();

app.engine("liquid", engine.express());
app.set("view engine", "liquid");

app.get("/", (req, res) => {
    const serveDir = path.join(localDir, ".serve");

    const allpaths = getFiles(serveDir);
    // console.log(allpaths);

    let fileLinks = allpaths
        .filter(file => file.endsWith(".html") || file.endsWith(".liquid"))
        .map(file => {
            const noExt = file.replace(/\.(html|liquid)$/, "");
            return `<li><a href="/${noExt}">${file}</a></li>`;
        })
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

app.get("*", (req, res, next) => {
    const noExtPath = req.path;
    const servePath = path.join(localDir, ".serve", noExtPath);
    // const filePath = path.join(localDir, req.path);
    
    const acceptedExtensions = [".html", ".liquid"];

    for (let ext of acceptedExtensions) {
        let fullPath = servePath + ext;

        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
            res.render(fullPath, context.getContext(), (err, html) => {
                if (err) {
                    next();
                } else {
                    res.send(html);
                }
            });
            return;
        }
    }

    res.status(404).send('File not found');
});

module.exports = {
    start: () => {
        mirrorFiles(localDir, path.join(localDir, ".serve"));

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
};
