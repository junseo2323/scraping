import { ObjectId } from "mongodb";

type TagToggleType = {
    home : string[],
    profile : string[]
}

export interface User {
    _id: string,
    password : string,
    name : string,
    subtitle : string,
    article : Array<ObjectId>,
    tagtoggle : TagToggleType
} 

export interface Tag {
    userid: string,
    tagname :string,
    color : string
} 