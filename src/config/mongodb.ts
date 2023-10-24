import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { env } from './environment';
import * as os from 'os';

@Injectable()
export class Database implements OnModuleInit, OnModuleDestroy {
  private mongoClientInstance: MongoClient;
  private db: Db;

  // Kết nối tới Database
  async onModuleInit() {
    this.mongoClientInstance = new MongoClient(env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await this.mongoClientInstance.connect();
    this.db = this.mongoClientInstance.db(env.DATABASE_NAME);
    console.log('Connected to MongoDB Cloud Atlas');

    // Gọi hàm countConnections để lấy số lượng kết nối
    await this.countConnections();
  }

  // Đóng kết nối tới Database khi cần
  async onModuleDestroy() {
    await this.mongoClientInstance.close();
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Must connect to the database first!');
    }
    return this.db;
  }
  async countConnections() {
    const collections = await this.db.listCollections().toArray();
    const numConnections = collections.length;
    console.log('Number of connections:', numConnections);

    return numConnections;
  }
  checkOverLoad() {
    setInterval(async () => {
      const numConnection = await this.countConnections();
      const numCores = os.cpus().length;
      const memoryUsage = process.memoryUsage().rss;
      // số lượng kết nối tối đa dựa trên số core
      const maxConnections = numCores * 5;
      console.log(`Active connections: ${numConnection}`);
      console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
      if (numConnection > maxConnections) {
        console.log('Connection overload detected!');
      }
    }, 5000);
  }
}
