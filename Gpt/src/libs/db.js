import pkg from "pg";
const { Client } = pkg;

const CLIENT_CONFIG = {
    user: 'dohhvmjc',
    host: 'tiny.db.elephantsql.com',
    password: 'oEBKjYiqpup99HUNLtRmj4h00CBYRCHj',
    db: 'dohhvmjc',
    port: 5432
};

async function verifyConnection() {
    try {
        const client = new Client(CLIENT_CONFIG);
        await client.connect();
        client.end();

        console.log('Connected to DB successfully');
    } catch (error) {
        console.error(error);
    }
}

async function query(stringQuery, replacement = [], config = {}) {
    try {
        const client = new Client(CLIENT_CONFIG);
        const result = await client.query(stringQuery, replacement);
        
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default { query, verifyConnection };