import amqp from 'amqplib';
import pino from 'pino';
const logger = pino();
let connection = null;
let channel = null;
export const connectRabbitMQ = async (url) => {
  connection = await amqp.connect(url);
  channel = await connection.createChannel();
  logger.info('✅ RabbitMQ connected (Auth)');
  return { connection, channel };
};
export const publish = async (queue, message) => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};
