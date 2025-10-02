import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function CategoryPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const {user} = useAuth();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`https://localhost:7051/api/Post/Get-By-Category/${id}`)
      .then(res => res.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">📂 Bài viết theo thể loại: {posts.categoryName}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400 italic">Không có bài viết nào trong thể loại này.</p>
      ) : (
       <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
               {posts.map(post => (
                 <div
                   key={post.id}
                   className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-5 border border-gray-200 dark:border-gray-700"
                 >
                   {/*Author*/}
                   <div className="flex items-center gap-3 mb-3">
                     <button
                       onClick={() => {
                         if (!user) {
                           toast.info('🔒 Bạn cần đăng nhập để xem hồ sơ người dùng');
                           navigate('/login');
                         } else {
                           navigate(`/users/${post.authorId}`);
                         }
                       }}
                       className="flex items-center gap-2 hover:underline"
                     >
                       <img
                         src={BASE_URL + post.authorAvatarUrl}
                         alt="avatar"
                         className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-200"
                       />
                       <p className="text-sm text-gray-600 dark:text-gray-400">✍️ {post.authorName}</p>
                     </button>
                   </div>
       
                   {/* Header */}
                   <div className="mb-3">
                     <h3 className="text-xl font-semibold  flex items-center gap-2">
                       📝 {post.title}
                     </h3>
                     <span className="text-xs text-gray-500 dark:text-gray-400">
                       📅 {new Date(post.publishedAt).toLocaleDateString()}
                     </span>
                   </div>
       
                   {/* Cover Image */}
                   {post.coverImage && (
                     <img
                       src={BASE_URL + post.coverImage}
                       alt="cover"
                       className="rounded-md w-full object-cover max-h-[300px] mb-4 hover:scale-[1.02] transition-transform"
                     />
                   )}
       
                   {/* Summary */}
                   <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Tóm tắt: {post.summary}</p>
                   <div className="text-sm text-left text-gray-700 dark:text-gray-300 mb-3 space-y-2">
                     {post.content.slice(0, 2).map((block, index) => (
                       <div key={index}>
                         <p>{block.topContent}</p>
                         <p>{block.bottomContent}</p>
                       </div>
                     ))}
                   </div>
       
                   {/* Footer */}
                   <div className="flex justify-between items-center">
                     <div className="flex flex-wrap gap-2">
                       {post.tags.map(tag => (
                         <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                           #{tag}
                         </span>
                       ))}
                     </div>
                     <Link
                       to={`/posts/${post.id}`}
                       className="text-blue-500 hover:underline text-sm font-medium"
                     >
                       🔍 Xem chi tiết
                     </Link>
                   </div>
                 </div>
               ))}
             </div>
      )}
    </div>
  );
}
