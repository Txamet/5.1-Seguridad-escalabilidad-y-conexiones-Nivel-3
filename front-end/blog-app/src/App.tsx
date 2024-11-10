import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostList from './pages/Posts';
import PostPage from './pages/PostPage';
import CreatePost from './pages/CreatePost';
import UserPostList from './pages/UserPosts';
import UserDeletedPostList from './pages/UserDeletedPosts';
import EditPost from './pages/EditPost';
import EditProfile from './pages/EditProfile';
import UsersList from './pages/UsersList';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:userId" element={<Profile />} />
        <Route path="/users/:userId/edit" element={<EditProfile />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostPage />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:postId/edit" element={<EditPost />} />
        <Route path="/posts/users/:userId" element={<UserPostList />} />
        <Route path="/posts/users/:userId/deleted" element={<UserDeletedPostList />} />
      </Routes>
    </Router>
  );
};

export default App;
