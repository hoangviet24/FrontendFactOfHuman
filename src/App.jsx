import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/User/loginPage';
import PostListPage from './pages/Posts/postListPage';
import PostDetailPage from './pages/Posts/postDetailPage';
import RegisterPage from './pages/Auth/User/registerPage';
import NavbarPortal from './components/NavbarPortal';
import ProfilePage from './pages/Auth/Author/profilePage';
import UpdateProfilePage from './pages/Auth/User/updateProfilePage';
import CategoryPage from './pages/Category/categoryPage';
import SearchResultPage from './pages/Posts/serachResultPage';
import CreatePostPage from './pages/Posts/CreatePostPage';
import UpgradeRolePage from './pages/Posts/updareRole';
import AuthorPostManager from './pages/Auth/Author/AuthorPostManager';
import AdminLayout from './pages/Auth/Admin/AdminLayout';
import AdminRoute from './pages/Auth/Admin/AdminRoute';
import CategoryManager from './pages/Auth/Category/CategoryManager';
import TagManager from './pages/Auth/Tags/TagManager';
import { Navigate } from 'react-router-dom';
import UserProfilePage from './pages/Auth/User/userProfilePage';
import UserPostsPage from './pages/Auth/User/UserPostPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavbarPortal />
      <Routes >
        <Route path="/" element={< PostListPage />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="categories" />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="tags" element={<TagManager />} />
        </Route>
        <Route path="/users/:id?" element={<UserProfilePage />} />
        <Route path="/profile-posts/:id" element={<UserPostsPage />} />
        <Route path='/posts' element={<PostListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/update-profile' element={<UpdateProfilePage />} key='update' />
        <Route path='/category/:id' element={<CategoryPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path='/upgrade-role' element={<UpgradeRolePage />} />
        <Route path='/profile-posts' element={<AuthorPostManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;