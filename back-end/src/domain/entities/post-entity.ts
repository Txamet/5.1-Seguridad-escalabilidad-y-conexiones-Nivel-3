export interface PostEntity {
    id: string;
    title: string; 
    content: string; 
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean; 
    userId: string;
}