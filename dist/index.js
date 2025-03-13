"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const { KafkaJS } = require("@confluentinc/kafka-javascript");
function readConfig(fileName) {
    const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
    return data.reduce((config, line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            config[key] = value;
        }
        return config;
    }, {});
}
async function produce(topic, config) {
    const key = "key";
    const value = "value";
    // create a new producer instance
    const kafka = KafkaJS(config);
    const producer = kafka.producer();
    // connect the producer to the broker
    await producer.connect();
    // send a single message
    const produceRecord = await producer.send({
        topic,
        messages: [{ key, value }],
    });
    console.log(`\n\n Produced message to topic ${topic}: key = ${key}, value = ${value}, ${JSON.stringify(produceRecord, null, 2)} \n\n`);
    // disconnect the producer
    await producer.disconnect();
}
async function consume(topic, config) {
    // setup graceful shutdown
    const kafka = new KafkaJS();
    const consumer = kafka.consumer({ groupId: "nodejs-group-1" });
    const disconnect = () => {
        consumer.commitOffsets().finally(() => {
            consumer.disconnect();
        });
    };
    process.on("SIGTERM", disconnect);
    process.on("SIGINT", disconnect);
    // connect the consumer to the broker
    await consumer.connect();
    // subscribe to the topic
    await consumer.subscribe({ topics: [topic] });
    // consume messages from the topic
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Consumed message from topic ${topic}, partition ${partition}: key = ${message.key.toString()}, value = ${message.value.toString()}`);
        },
    });
}
async function main() {
    const config = readConfig("client.properties");
    const topic = "topic_0";
    await produce(topic, config);
    await consume(topic, config);
}
main();
