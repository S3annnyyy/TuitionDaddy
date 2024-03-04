import pkg from "pg";
const { Client } = pkg;


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