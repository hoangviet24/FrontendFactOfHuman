import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostsByUserId } from '../../../services/postService';

export default function UserPostsPage() {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        getPostsByUserId(id).then(setPosts).catch(() => setPosts([]));
    }, [id]);

    if (!posts.length) {
        return <p className="text-center text-gray-400 mt-20">😢 Người dùng này chưa có bài viết nào.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 text-white">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">📚 Bài viết của người dùng</h2>

            <ul className="space-y-6">
                {posts.map(post => (
                    <li key={post.id}>

                        <Link
                            to={`/posts/${post.id}`}
                            className="block bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-700 hover:bg-gray-800"
                        >
                            {/* Tiêu đề + ngày + thể loại */}
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white">{post.title}</h3>
                                <p className="text-sm text-gray-400">
                                    {new Date(post.publishedAt).toLocaleDateString()} • {post.categoryName}
                                </p>
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

                            {/* Nội dung rút gọn */}
                            <div className="text-sm text-left text-gray-300 mb-3 space-y-2">
                                {post.content.slice(0, 2).map((block, index) => (
                                    <div key={index}>
                                        <p>{block.topContent}</p>
                                        <p>{block.bottomContent}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {post.tags.map(tag => (
                                    <span key={tag} className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

}