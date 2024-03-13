import amqp, { type Channel, type Connection } from "amqplib";

const amqpUrl: string | undefined = process.env.AMQP_URL;

let amqpConnection: Connection;
let amqpChannel: Channel;

async function connectToAMQP() {
  if (!amqpConnection || !amqpChannel) {
    try {
      if (!amqpUrl) {
        throw new Error("AMQP URL is not defined");
      }

      amqpConnection = await amqp.connect(amqpUrl);
      amqpChannel = await amqpConnection.createChannel();
      console.log("Connected successfully to AMQP server");

      // Setup an exchange for the chat messages
      await amqpChannel.assertExchange("chatAppExchange", "topic", { durable: false });
    } catch (err) {
      console.error("AMQP connection error:", err);
      throw err; // Re-throw the error to handle it in the calling function
    }
  }
}

// Ensure connection on module load
connectToAMQP().catch(console.error);

export { amqpConnection, amqpChannel, connectToAMQP };
