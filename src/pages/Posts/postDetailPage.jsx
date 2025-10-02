import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createComment, getCommentsByPostId } from '../../services/commentService';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { IconDotsVertical, IconTrash, IconEdit } from '@tabler/icons-react';
import { deleteComment } from '../../services/commentService';

import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = import.meta.env.VITE_API_URL
export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [activeDropdown, setActiveDropdown] = useState(null);
    const commentsEndRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        getPostById(id).then(setPost);
    }, [id]);
    // Lấy comment cũ khi load trang
    useEffect(() => {
        getCommentsByPostId(id).then(setComments);
    }, [id]);
    useEffect(() => {
  commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [comments]);
    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/hubs/comments?postId=${id}`)
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            console.log("Connected to SignalR");
        });

        connection.on("ReceiveComment", (comment) => {
            setComments(prev => [...prev,comment ]);
        });

        return () => {
            connection.stop();
        };
    }, [id]);
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId); // gọi API xóa comment
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success("🗑️ Đã xóa bình luận");
        } catch {
            toast.error("❌ Lỗi khi xóa bình luận");
        }
    };


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
            <div className="flex flex-col max-h-[400px] border border-gray-600 rounded overflow-y-auto">
                
            </div>
            <div className="mt-10">
                <h2 className="text-3xl font-semibold mb-4 text-left">Bình luận</h2>

                {comments.map(c => (
                    <div
                        key={c.id}
                        className="border-b border-gray-700 py-3 text-left flex justify-between items-start relative"
                    >
                        <div className="flex-1">
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

                            <p className="text-xxl text-gray-200 mt-1">{c.content}</p>
                        </div>

                        {/* Menu 3 chấm */}
                        {user?.id === c.userId && (
                            <div className="relative flex-shrink-0 ml-2">
                                <button
                                    onClick={() =>
                                        setActiveDropdown(activeDropdown === c.id ? null : c.id)
                                    }
                                    className="p-2 rounded hover:bg-gray-700 transition"
                                >
                                    <IconDotsVertical size={18} className="text-gray-300" />
                                </button>

                                {activeDropdown === c.id && (
                                    <ul className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-20 text-sm text-gray-700 overflow-hidden border border-gray-200">
                                        <li>
                                            <button
                                                onClick={() => toast.info("✏️ Chức năng sửa đang phát triển")}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                ✏️ Sửa
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => {
                                                    handleDeleteComment(c.id);
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
                        )}
                    </div>
                ))}
                <div ref={commentsEndRef} />
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