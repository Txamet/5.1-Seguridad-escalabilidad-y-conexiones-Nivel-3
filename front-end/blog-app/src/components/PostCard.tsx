import React from 'react';

interface PostCardProps {
  //id: string  
  title: string  
  content: string;
  author: string;
  createdAt: string;
  popularity: number;
}

const PostCard: React.FC<PostCardProps> = ({ title, content, author, createdAt, popularity }) => {
  return (
    <div className="post-card">
      <h3>{title}</h3>
      <p>{content}</p>
      <p>{author}</p>
      <p>{new Date(createdAt).toLocaleString()}</p>
      <p>Popularitat: {popularity}%</p>
    </div>
  );
};

export default PostCard;
