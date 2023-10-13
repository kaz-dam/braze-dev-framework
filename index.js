const chokidar = require('chokidar');
const axios = require('axios');
const fs = require('fs');
const { Liquid } = require('liquid-linter');
const open = require('open');

// const lintConfig = require('./liquid-linter.config.json');
const brazeEndpoint = process.env.BRAZE_API_ENDPOINT;

const watcher = chokidar.watch(['**/*.html', '**/*.liquid'], {
    ignored: /(^|[\/\\])\../,
    persistent: true
});

watcher.on('change', async (path) => {
    console.log(`File ${path} has been changed`);

    let fileContent = fs.readFileSync(path, 'utf8');

    // TODO: Implement Braze specific linter?
    // const liquid = new Liquid();
    // const errors = liquid.lint(fileContent, lintConfig);
    // if (errors.length > 0) {
    //     console.error('Lint errors:', errors);
    //     return;
    // }

    try {
        const response = await axios.post(BRAZE_ENDPOINT, { content: fileContent });
        const renderedHTML = response.data;

        const tempFilePath = './temp.html';
        fs.writeFileSync(tempFilePath, renderedHTML, 'utf8');
        open(tempFilePath);
    } catch (error) {
        console.error('Error sending data to Braze:', error);
    }
});
