const fs = require("fs");
const path = require("path");

class LiquidContext {
    constructor() {
        this.contextPath = path.join(process.cwd(), "liquid-context.json");
    }

    getContext() {
        if (fs.existsSync(this.contextPath)) {
            const contextData = fs.readFileSync(this.contextPath, "utf-8");
            return JSON.parse(contextData);
        } else {
            console.warn(`No 'liquid-context.json' found in ${process.cwd()}. Using empty context.`);
            return {};
        }
    }
}

module.exports = LiquidContext;
