import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Client } = pkg;

const CLIENT_CONFIG = {
    connectionString: process.env.DB_URI,
};

console.log(CLIENT_CONFIG);

async function verifyConnection() {
    try {
        const client = new Client(CLIENT_CONFIG);
        await client.connect();

        console.log('Connected to DB successfully');
        await client.end();
    } catch (error) {
        console.error(error);
    }
}

async function query(stringQuery, replacement = [], config = {}) {
    const client = new Client(CLIENT_CONFIG); 
    try {
        await client.connect(); 
        const res = await client.query(stringQuery, replacement);

        return res.rows; 
    } catch (e) {
        console.error(e.stack);
        throw e;
    } finally {
        await client.end(); 
    }
}

export default { query, verifyConnection };