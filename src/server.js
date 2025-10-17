import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './infrastructure/database/mongoose.js';
import { connectRedis } from './infrastructure/cache/redisClient.js';
import { connectRabbitMQ } from './infrastructure/messaging/rabbitmqConnection.js';

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  await connectRedis(process.env.REDIS_URL);
  await connectRabbitMQ(process.env.RABBITMQ_URL);
  app.listen(PORT, () => console.log(`✅ Auth Service running on ${PORT}`));
};

start();
