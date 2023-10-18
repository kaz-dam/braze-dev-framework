#!/usr/bin/env node

const server = require("./server");
const FileWatcher = require("./watcher");

server.start();

const watcher = new FileWatcher();
watcher.init();

console.log("Watching for changes in the serve directory...");
