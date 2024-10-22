export interface PostEntity {
    id: string;
    title: string; 
    content: String; 
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean; 
    userId: string;
}