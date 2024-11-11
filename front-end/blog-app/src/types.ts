export interface User {
    id: string;
    name: string
    email: string;
    password: string;
    role: string;
    deleted: boolean;
}

export interface Post {
    author: string;
    popularity: string;
    post: {
      id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      deleted: boolean;
      userId: string;
    }
}