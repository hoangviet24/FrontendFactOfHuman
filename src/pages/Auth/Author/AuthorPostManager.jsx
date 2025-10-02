import { useEffect, useState } from 'react';
import { getAuthorPosts, deletePostById } from '../../../services/postService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconDotsVertical } from '@tabler/icons-react';

export default function AuthorPostManager() {
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getAuthorPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deletePostById(selectedId);
      toast.success('🗑️ Đã xóa bài viết!');
      setPosts(prev => prev.filter(post => post.id !== selectedId));
      setShowModal(false);
    } catch (err) {
      toast.error('❌ ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      {/* Modal xác nhận xóa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-gray-800">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa bài viết</h2>
            <p className="text-sm mb-4">Bạn có chắc muốn xóa bài viết này không?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-blue-400 mb-6">📚 Bài viết của bạn</h2>

      {posts.length === 0 ? (
        <p className="text-gray-400">Bạn chưa có bài viết nào.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => (
            <li
              key={post.id}
              className="relative bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString()} • {post.categoryName}
                  </p>
                </div>

                {/* Dropdown ba chấm */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === post.id ? null : post.id)
                    }
                    className="p-2 rounded hover:bg-gray-700 transition"
                  >
                    <IconDotsVertical size={18} className="text-gray-300" />
                  </button>

                  {activeDropdown === post.id && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => navigate(`/posts/${post.id}`)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          🔍 Xem
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(`/edit-post/${post.id}`)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          ✏️ Sửa
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setSelectedId(post.id);
                            setShowModal(true);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                        >
                          🗑️ Xóa
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Ảnh bìa */}
              {post.coverImage && (
                <img
                  src={BASE_URL + post.coverImage}
                  alt="cover"
                  className="rounded-md w-full object-cover max-h-[300px] mb-4"
                />
              )}

              {/* Tóm tắt */}
              <p className="text-gray-300 text-sm italic">{post.summary}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
