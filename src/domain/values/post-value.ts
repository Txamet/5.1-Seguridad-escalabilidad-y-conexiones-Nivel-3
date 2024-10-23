import { v4 as uuid } from "uuid"
import { PostEntity } from "../entities/post-entity";

export class PostValue implements PostEntity {
    id: string;
    title: string; 
    content: string; 
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean; 
    userId: string;

    constructor( title: string, content: string, userId: string) {
        this.id = uuid();
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deleted = false;
        this.userId = userId;
    }
}