import { MongoClient } from "mongodb"

const url = process.env.MONGO_URI;

export class Db {
  static async connect() {
    const client = await MongoClient.connect(url, {
      tls: true,  // TLS 연결 강제
    })
    return client.db('scraping')  // 'scraping' DB가 없으면 자동으로 생성됨
  }
}
