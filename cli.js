#!/usr/bin/env node

const server = require("./src/server");
const FileWatcher = require("./src/watcher");

server.start();

const watcher = new FileWatcher();
watcher.init();

console.log("Watching for changes in the directory...");
