import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';
import './filecss/UserMenu.css';
export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('Token');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="focus:outline-none"
      >
        <img
          src={BASE_URL + user.avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg hover:scale-105 transition"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100 transition"
          >
            Thông tin cá nhân
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="w-full text-left block px-4 py-2 hover:bg-gray-100 transition"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
