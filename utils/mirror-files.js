const fs = require("fs");
const path = require("path");
const getFiles = require("./get-files");

const mirrorFiles = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const filesToCopy = getFiles(src);

    filesToCopy.forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.copyFileSync(srcPath, destPath);
    });
};

module.exports = mirrorFiles;
