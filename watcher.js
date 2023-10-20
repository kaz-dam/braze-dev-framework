const chokidar = require("chokidar");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Liquid = require("brazejs");
const browserSync = require("browser-sync").create();

class FileWatcher {
    constructor() {
        this.brazeEndpoint = process.env.BRAZE_API_ENDPOINT;
        const currentDir = process.cwd();
        this.watcher = chokidar.watch([path.join(currentDir, "**/*.html"), path.join(currentDir, "**/*.liquid")], {
            ignored: /(^|[\/\\])\../,
            persistent: true,
        });
    }

    init() {
        browserSync.init({
            proxy: "http://localhost:3000",
        });

        this.watcher.on("change", this.handleChange.bind(this));
        this.brazeEngine = new Liquid();
    }

    async handleChange(path) {
        console.log(`File ${path} has been changed`);

        let fileContent = fs.readFileSync(path, "utf8");

        this.brazeEngine.parseAndRender(fileContent, {
            name: 'Adam'
        })
        .then(console.log)
        .catch(err => console.error(err.stack));

        try {
            // const response = await axios.post(this.brazeEndpoint, {
            //     content: fileContent,
            // });
            // const renderedHTML = response.data;

            // const tempFilePath = "./temp.html";
            // fs.writeFileSync(tempFilePath, renderedHTML, "utf8");
            browserSync.reload();
        } catch (error) {
            console.error("Error sending data to Braze:", error);
        }
    }
}

module.exports = FileWatcher;