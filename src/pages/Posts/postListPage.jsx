import { useEffect, useState } from 'react';
import { getAllPosts, getTop10 } from '../../services/postService';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const { user } = useAuth();
  const [skip, setSkip] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // có còn bài để load
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL
  
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const newPosts = await getAllPosts(skip, 30);
      setPosts(prev => [...prev, ...newPosts]);
      setSkip(prev => prev + 30);
      if (newPosts.length < 30) setHasMore(false); // hết bài
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    getTop10().then(setTopPosts);
    loadMorePosts(); // load 30 bài đầu tiên
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore &&
        !loadingMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [skip, hasMore, loadingMore]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">🔥 Top 10 bài viết nổi bật</h2>
      {topPosts.length === 0 ? (
        <div className="text-center text-gray-500 italic mb-10">
          😢 Hiện chưa có bài viết nổi bật nào.
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          effect="fade"
          slidesPerView={1}
          className="mb-10"
        >
          {topPosts.map(post => (
            <SwiperSlide key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-3xl mx-auto">
                  <img
                    src={BASE_URL + post.coverImage}
                    alt="cover"
                    className="rounded mb-3 h-40 w-full object-cover"
                  />
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>
                  <span className="text-blue-500 hover:underline mt-2 inline-block">Xem chi tiết</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <h2 className="text-2xl font-semibold mb-6">📚 Danh sách bài viết</h2>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 italic mb-10">
          🌐 Đang tải bài viết...
          <button
            onClick={() => window.location.reload()}
            className="ml-3 text-blue-500 underline"
          >
            Reload ngay
          </button>
        </div>
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
              <div className="flex flex-wrap gap-2">
                Thể loại:
                <span className="font-bold">
                  {post.categoryName}
                </span>
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
              <p className="text-xl mb-3">Tóm tắt: {post.summary}</p>
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