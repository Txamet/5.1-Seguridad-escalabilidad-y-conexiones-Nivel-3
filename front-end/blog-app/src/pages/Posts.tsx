import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import {Post} from "../types";
import { useNavigate } from 'react-router-dom';


const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postFilter, setPostFilter] = useState('New');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
        
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status == 403) {
          navigate("/");
        } else if (axios.isAxiosError(error) && error.response) {   
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert('Unkown error');
        }
        console.error(error);
      }
    };

    fetchPosts();
  }, [navigate]);

  useEffect(() => {
    let sortedPosts = [...posts];

    if (postFilter === 'New') {
      sortedPosts.sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());
    } else if (postFilter === 'popularity_asc') {
      sortedPosts.sort((a, b) => a.popularity - b.popularity);
    } else if (postFilter === 'popularity_desc') {
      sortedPosts.sort((a, b) => b.popularity - a.popularity);
    } else if (postFilter === 'author_asc') {
      sortedPosts.sort((a, b) => a.author.localeCompare(b.author));
    } else if (postFilter === 'author_desc') {
      sortedPosts.sort((a, b) => b.author.localeCompare(a.author));
    }

    if (searchTerm) {
      sortedPosts = sortedPosts.filter((post) =>
        post.data.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(sortedPosts);
  }, [posts, postFilter, searchTerm]); 

  const handleSearch = (value: string) => {
    setSearchTerm(value); 
  };

  return (
    <>
      <Navbar />
      <div className="form">
        <h2>Posts</h2>
        <SearchBar onSearch={handleSearch} />
        <select value={postFilter} onChange={(e) => setPostFilter(e.target.value)}>
          <option value="New">Newest</option>
          <option value="popularity_asc">Ascendent popularity</option>
          <option value="popularity_desc">Descendant popularity</option>
          <option value="author_asc">Author A-Z</option>
          <option value="author_desc">Author Z-A</option>
        </select>
        {filteredPosts.map((post) => (
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
