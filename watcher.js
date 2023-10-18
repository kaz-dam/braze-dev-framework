const chokidar = require("chokidar");
const axios = require("axios");
const fs = require("fs");
const browserSync = require("browser-sync").create();

class FileWatcher {
    constructor() {
        this.brazeEndpoint = process.env.BRAZE_API_ENDPOINT;
        this.watcher = chokidar.watch(["**/*.html", "**/*.liquid"], {
            ignored: /(^|[\/\\])\../,
            persistent: true,
        });
    }

    init() {
        browserSync.init({
            proxy: "http://localhost:3000",
        });

        this.watcher.on("change", this.handleChange.bind(this));
    }

    async handleChange(path) {
        console.log(`File ${path} has been changed`);

        let fileContent = fs.readFileSync(path, "utf8");

        // TODO: Implement Braze specific linter?
        // const liquid = new Liquid();
        // const errors = liquid.lint(fileContent, lintConfig);
        // if (errors.length > 0) {
        //     console.error('Lint errors:', errors);
        //     return;
        // }

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