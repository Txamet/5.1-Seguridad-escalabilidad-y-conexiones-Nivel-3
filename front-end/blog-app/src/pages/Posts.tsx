/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/NavBar';

interface Post {
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

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
    <Navbar />
    <div className='form'>
      <h2>Posts</h2>
        {posts.map((post: any) => (
          <div key={post.data.id} className="post">
            <Link to={`/posts/${post.data.id}`}>
              <h3>{post.data.title}</h3>
              <p>{post.data.content.substring(0, 100)}...</p>
              <small>Author: {post.author}</small><br />
              <small>Popularity: {post.popularity}%</small><br />
              <small>Creation date: {new Date(post.data.createdAt).toLocaleDateString()}</small>
              <p></p><br />
            </Link>
          </div>
        ))}
    </div>
    </>
  );
};

export default PostList;
