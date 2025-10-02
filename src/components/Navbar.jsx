import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './userMenu';
import './filecss/Navbar.css';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(BASE_URL + '/api/Category/Get-All')
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setCategories(shuffled.slice(0, 5));
      })
      .catch(() => setCategories([]));
  }, [BASE_URL]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?name=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleCreatePost = () => {
    const token = localStorage.getItem('Token');
    if (!token) {
      toast.info('🔒 Vui lòng đăng nhập để tạo bài viết');
      navigate('/login');
      return;
    }

    if (!user) return;

    if (user.roles === 'Reader') {
      navigate('/upgrade-role');
    } else {
      navigate('/create-post');
    }
  };

  return (
    <div className="w-full sticky top-0 z-50 shadow">
      {/* Tầng 1 */}
      <nav className="text-white px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-4 justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:scale-105 transition">📰 Fact of Human</Link>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-4">
            <input
              type="text"
              placeholder="🔍 Tìm bài viết theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l bg-white text-black focus:outline-none"
            />
            <button type="submit" className="bg-blue-800 px-4 rounded-r hover:bg-blue-900">Tìm</button>
          </form>

          <button
            onClick={handleCreatePost}
            className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition"
          >
            ✍️ Tạo bài viết
          </button>

          <div className="flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-gray-300 italic">Đang tải...</span>
            ) : user ? (
              <UserMenu user={user} />
            ) : (
             <div className="flex gap-2">
  <Link
    to="/login"
    className="px-4 py-2 bg-blue-600 rounded text-white text-sm font-medium hover:bg-blue-700 transition"
  >
    Đăng nhập
  </Link>
  <Link
    to="/register"
    className="px-4 py-2 border border-blue-600 rounded text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
  >
    Đăng ký
  </Link>
</div>

            )}
          </div>

        </div>
      </nav>

      {/* Tầng 2 */}
      <div className="text-white px-6 py-2 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex justify-between flex-wrap gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="text-white hover:text-blue-200 hover:underline px-2 py-1 text-sm font-medium transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}