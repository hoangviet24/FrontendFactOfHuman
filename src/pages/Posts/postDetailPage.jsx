import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/postService';
import '../filecss//PostDetailPage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = import.meta.env.VITE_API_URL
export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        getPostById(id).then(setPost);
    }, [id]);

    if (!post) return <p>Đang tải bài viết...</p>;

    const formattedDate = new Date(post.publishedAt.split('.')[0]).toLocaleDateString();

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 text-white">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{post.title}</h1>
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={BASE_URL + post.authorAvatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-200"
                />
                <a
                    href={`/users/${post.authorId}`}
                    className="text-sm text-blue-300 hover:underline"
                >
                    ✍️ {post.authorName}
                </a>
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

        </div>

    );
}