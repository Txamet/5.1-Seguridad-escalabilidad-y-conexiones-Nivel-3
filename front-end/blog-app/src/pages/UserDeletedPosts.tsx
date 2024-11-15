import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/NavBar';
import axios from 'axios';
import {Post} from "../types"


const UserDeletedPostList: React.FC = () => {
 
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const userId = localStorage.getItem("userId")  
      const response = await api.get(`/posts/users/${userId}/deleted`);
      setPosts(response.data);
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Unkown error');
      }
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar /> 
      <div className='form'>
        <h2>{localStorage.getItem("username")} Deleted Posts</h2>
          {posts.map((post: Post) => (
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

export default UserDeletedPostList;