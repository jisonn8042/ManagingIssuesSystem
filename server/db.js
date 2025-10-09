const { Client } = require("pg");
const path = require("path");
//require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// 비동기 연결 처리
client.connect()
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
        process.exit(1);
    });

module.exports = client;