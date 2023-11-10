const express = require("express");
const path = require("path");
const fs = require("fs");
const Liquid = require("brazejs");
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
const templatesDir = path.join(__dirname, '..', 'templates');

app.engine("liquid", engine.express());
app.set("view engine", "liquid");

app.get("/", (req, res) => {
    const serveDir = path.join(localDir, ".serve");

    const allpaths = getFiles(serveDir);
    const templatePath = path.join(templatesDir, 'index.liquid');

    let fileLinks = allpaths
        .filter(file => file.endsWith(".html") || file.endsWith(".liquid"))
        .map(file => {
            const noExt = file.replace(/\.(html|liquid)$/, "");
            return {
                url: noExt,
                name: file
            };
        });

    fs.readFile(templatePath, 'utf8', (err, templateContent) => {
        if (err) return res.status(500).send("Failed to read template file");

        engine.parseAndRender(templateContent, { links: fileLinks })
            .then(renderedHtml => {
                res.send(renderedHtml);
            })
            .catch(renderErr => {
                res.status(500).send("Error in rendering template");
            });
    });
});

app.get("*", (req, res, next) => {
    const noExtPath = req.path;
    const servePath = path.join(localDir, ".serve", noExtPath);
    
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
