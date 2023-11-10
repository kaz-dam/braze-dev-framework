const chokidar = require("chokidar");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Liquid = require("brazejs");
const browserSync = require("browser-sync").create();
const LiquidContext = require("./liquid-context");

class FileWatcher {
    constructor() {
        this.brazeEndpoint = process.env.BRAZE_API_ENDPOINT;
        const currentDir = process.cwd();
        this.serveDir = path.join(currentDir, "serve");
        this.watcher = chokidar.watch([path.join(currentDir, "**/*.html"), path.join(currentDir, "**/*.liquid")], {
            ignored: [/(^|[\/\\])\../, this.serveDir],
            persistent: true,
        });
    }

    init() {
        browserSync.init({
            proxy: "http://localhost:3000",
        });

        this.watcher.on("change", this.handleChange.bind(this));
        this.brazeEngine = new Liquid();
        this.liquidContext = new LiquidContext();
    }

    handleChange(filePath) {
        console.log(`File ${filePath} has been changed`);

        let fileContent = fs.readFileSync(filePath, "utf8");
        const context = this.liquidContext.getContext();

        this.brazeEngine.parseAndRender(fileContent, context)
            .then((renderedContent) => {
                const fileName = path.basename(filePath);
                const savePath = path.join(this.serveDir, fileName);

                fs.writeFileSync(savePath, renderedContent, "utf8");
                browserSync.reload();
            })
            .catch(err => console.error(err.stack));
    }
}

module.exports = FileWatcher;