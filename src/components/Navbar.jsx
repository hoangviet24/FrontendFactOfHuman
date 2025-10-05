import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import './filecss/Navbar.css';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false); // menu mobile
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
      setOpen(false);
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
    setOpen(false);
  };

  return (
    <div className="w-full sticky top-0 z-50 shadow">
      {/* Tầng 1 */}
      <nav className="px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-lg md:text-xl font-bold hover:scale-105 transition">
            📰 Fact of Human
          </Link>

          {/* Form search desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <input
              type="text"
              placeholder="🔍 Tìm bài viết theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l border focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 rounded-r border hover:scale-105 transition"
            >
              Tìm
            </button>
          </form>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleCreatePost}
              className="font-semibold py-2 px-4 rounded border hover:scale-105 transition"
            >
              ✍️ Tạo bài viết
            </button>
            {loading ? (
              <span className="text-sm italic">Đang tải...</span>
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 border rounded text-sm font-medium hover:scale-105 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border rounded text-sm font-medium hover:scale-105 transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            {open ? "✖" : "☰"}
          </button>
        </div>
      </nav>

      {/* Tầng 2 desktop */}
      <div className="hidden md:block px-6 py-2 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex justify-between w-full">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="flex-1 text-center hover:underline px-2 py-1 text-sm font-medium transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>


      {/* Menu mobile xổ xuống */}
      <div
        className={`md:hidden flex flex-col px-4 py-3 gap-3 overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {/* Search mobile */}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="🔍 Tìm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l border focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 rounded-r border hover:scale-105 transition"
          >
            Tìm
          </button>
        </form>

        {/* Tạo bài viết */}
        <button
          onClick={handleCreatePost}
          className="font-semibold py-2 px-4 rounded border hover:scale-105 transition"
        >
          ✍️ Tạo bài viết
        </button>

        {/* User menu / login */}
        {loading ? (
          <span className="text-sm italic">Đang tải...</span>
        ) : user ? (
          <UserMenu user={user} />
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded text-sm font-medium hover:scale-105 transition"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded text-sm font-medium hover:scale-105 transition"
            >
              Đăng ký
            </Link>
          </div>
        )}

        {/* Categories mobile */}
        <div className="flex flex-col gap-2 mt-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={() => setOpen(false)}
              className="hover:underline px-2 py-1 text-sm font-medium transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
