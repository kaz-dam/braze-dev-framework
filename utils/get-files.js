const fs = require("fs");
const path = require('path');

const getFiles = (dir, fileList = [], relativePath = '', excludeDir = ".serve") => {
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
            getFiles(filePath, fileList, path.join(relativePath, file));
        } else {
            fileList.push(path.join(relativePath, file));
        }
    });

    return fileList;
}

module.exports = getFiles;