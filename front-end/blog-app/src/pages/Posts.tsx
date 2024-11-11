/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/NavBar';

interface Post {
  author: string;
  popularity: number;
  data: {
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
  const [postFilter, setPostFilter] = useState("New");

  

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

  let filteredPosts;

  if ( postFilter === "New") {
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.data.createdAt).getTime();
      const dateB = new Date(b.data.createdAt).getTime();

      return dateB - dateA
    });
    
    filteredPosts = sortedPosts.map((post: any) => (
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
    )) 

  } else if ( postFilter === "popularity_asc" ) {
    const sortedPosts = posts.sort((a, b) => a.popularity - b.popularity);
    filteredPosts = sortedPosts.map((post: any) => (
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
    )) 

  } else if ( postFilter === "popularity_desc" ) {
    const sortedPosts = posts.sort((a, b) => b.popularity - a.popularity);
    filteredPosts = sortedPosts.map((post: any) => (
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
    )) 
  } else if ( postFilter === "author_asc") {
    const sortedPosts = posts.sort((a, b) => a.author.localeCompare(b.author));
    filteredPosts = sortedPosts.map((post: any) => (
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
    ))
  } else if ( postFilter === "author_desc" ) {
    const sortedPosts = posts.sort((a, b) => b.author.localeCompare(a.author));
    filteredPosts = sortedPosts.map((post: any) => (
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
    )) 
  }

  return (
    <>
    <Navbar />
    <div className='form'>
      <h2>Posts</h2>
        <label></label>      
        <select value={postFilter} onChange={(e) => setPostFilter(e.target.value)}>
          <option value="New">Newest</option>
          <option value="popularity_asc">Ascendent popularity</option>
          <option value="popularity_desc">Descendant popularity</option>
          <option value="author_asc">Author A-Z</option>
          <option value="author_desc">Author Z-A</option>
        </select>
        {filteredPosts}
    </div>
    </>
  );
};

export default PostList;
