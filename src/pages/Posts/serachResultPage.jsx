import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import debounce from 'lodash.debounce';

export default function SearchResultPage() {
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('name') || '';
  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchPosts = debounce((keyword) => {
    if (!keyword.trim()) return setPosts([]);
    fetch(`${BASE_URL}/api/Post/Get-By-Name?name=${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, 500); // gọi sau 500ms khi ngừng gõ

  useEffect(() => {
    fetchPosts(query);
    return () => fetchPosts.cancel(); // cleanup
  }, [fetchPosts, query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Tìm bài viết..."
        className="w-full p-3 mb-6 rounded bg-gray-800 text-white border border-gray-600"
      />
      {posts.length === 0 ? (
        <p className="text-gray-400 italic">Không tìm thấy bài viết nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition">
              <img src={BASE_URL + post.coverImage} alt="cover" className="rounded mb-3 h-40 w-full object-cover" />
              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{post.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>
              <a href={`/posts/${post.id}`} className="text-blue-500 hover:underline mt-2 inline-block">Xem chi tiết</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
