const fs = require("fs");
const path = require('path');

const getFiles = (dir, fileList = [], relativePath = '', excludeDir = "serve") => {
    const files = fs.readdirSync(dir);

    let validFiles = files.filter(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            return file !== excludeDir;
        }

        return file.endsWith(".html") || file.endsWith(".liquid");
    });

    validFiles.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Recursive call for directories
            getFiles(filePath, fileList, path.join(relativePath, file));
        } else {
            // Push the relative path of the file
            fileList.push(path.join(relativePath, file));
        }
    });

    return fileList;
}

module.exports = getFiles;