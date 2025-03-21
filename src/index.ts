import * as fs from "fs";
import { consume } from "./consumer.js";

export function readConfig(fileName: string): Record<string, string> {
    const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
    return data.reduce((config: Record<string, string>, line: string) => {
        const [key, value] = line.split("=");
        if (key && value) {
            config[key] = value;
        }
        return config;
    }, {});
}

async function main() {
    const config = readConfig("client.properties");
    const topic = "topic_0";

    await consume(topic, config);
}

main();