import { ObjectId } from "mongodb";

export interface User {
    _id: string,
    password : string,
    name : string,
    subtitle : string,
    article : Array<ObjectId>
} 