import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createComment, getCommentsByPostId } from '../../services/commentService';
import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = import.meta.env.VITE_API_URL
export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        getPostById(id).then(setPost);
    }, [id]);
    useEffect(() => {
        if (id) {
            getCommentsByPostId(id).then(setComments);
        }
    }, [id]);

    const handleAddComment = async () => {
        if (!user) {
            toast.info("🔒 Bạn cần đăng nhập để bình luận");
            navigate("/login");
            return;
        }
        if (!newComment.trim()) return;

        try {
            await createComment(id, newComment);
            toast.success("💬 Bình luận thành công!");
            setNewComment("");
            const updated = await getCommentsByPostId(id);
            setComments(updated);
        } catch {
            toast.error("❌ Lỗi khi gửi bình luận");
        }
    };
    if (!post) return <p>Đang tải bài viết...</p>;

    const formattedDate = new Date(post.publishedAt.split('.')[0]).toLocaleDateString();

    return (

        <div className="max-w-3xl mx-auto px-4 py-10 text-white">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{post.title}</h1>
            <div className="flex items-center gap-3 mb-4">
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
                <span className="text-sm text-gray-400">• {formattedDate}</span>
            </div>
            <img src={BASE_URL + post.coverImage} alt="cover" className="rounded-lg my-6 mx-auto w-full max-w-3xl object-cover" />
            <p className=" mb-4 italic">Tóm tắt: {post.summary}</p>
            <div className="flex gap-2 mb-6">
                {post.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{post.categoryName}</span>
            </div>

            {post.content.map((block, index) => (
                <div key={index} className="mb-10 space-y-4">
                    {/* Top Content */}
                    {block.topContent && (
                        <p className="text-white text-base leading-relaxed text-left max-w-2xl">{block.topContent}</p>

                    )}

                    {/* Top Image */}
                    {block.topImage && (
                        <img
                            src={BASE_URL + block.topImage}
                            alt={`Top image ${index + 1}`}
                            className="rounded w-full object-contain max-h-[400px]"
                        />
                    )}

                    {/* Bottom Content */}
                    {block.bottomContent && (
                        <p className="text-white text-base leading-relaxed text-left max-w-2xl">{block.bottomContent}</p>

                    )}

                    {/* Bottom Image */}
                    {block.bottomImage && (
                        <img
                            src={BASE_URL + block.bottomImage}
                            alt={`Bottom image ${index + 1}`}
                            className="rounded w-full object-contain max-h-[400px]"
                        />
                    )}
                </div>
            ))}
            <div className="mt-10">
                <h2 className="text-3xl font-semibold mb-4 text-left">Bình luận</h2>

                {comments.map(c => (
                    <div
                        key={c.id}
                        className="border-b border-gray-700 py-3 text-left"
                    >
                        {/* Avatar + Tên: click để đi tới trang user */}
                        <button
                            onClick={() => {
                                if (!user) {
                                    toast.info("🔒 Bạn cần đăng nhập để xem hồ sơ người dùng");
                                    navigate("/login");
                                } else {
                                    navigate(`/users/${c.userId}`);
                                }
                            }}
                            className="flex items-center gap-2 hover:underline"
                        >
                            <img
                                src={BASE_URL + c.avatarUser}
                                alt={c.userName}
                                className="w-8 h-8 rounded-full object-cover border border-gray-600"
                            />
                            <p className="text-sm font-semibold text-blue-400">{c.userName}</p>
                        </button>

                        {/* Nội dung comment */}
                        <p className="text-xxl text-gray-200  mt-1">{c.content}</p>
                    </div>
                ))}

                {/* Form nhập */}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                        placeholder="Viết bình luận..."
                        className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-600"
                    />
                    <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-blue-600 rounded text-white"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>


    );
}