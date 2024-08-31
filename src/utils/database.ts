import { MongoClient } from "mongodb"

const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0'

export class Db {
    static async connect() {
      const client = await MongoClient.connect(
        url      
    )
      return client.db('testDatabase')
    }
  }
