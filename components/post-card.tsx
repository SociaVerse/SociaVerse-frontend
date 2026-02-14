"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Share2, MoreHorizontal, BadgeCheck, Send, X, Trash2, Edit2, Reply, CornerDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Post, Comment, api } from "@/services/api"
import { useAuth } from "@/components/auth-provider"

interface PostCardProps {
    post: Post;
    handleAuthAction: (action: () => void) => void;
}

export function PostCard({ post: initialPost, handleAuthAction }: PostCardProps) {
    const [post, setPost] = useState(initialPost);
    const [isLiked, setIsLiked] = useState(initialPost.is_liked);
    const [likesCount, setLikesCount] = useState(initialPost.likes_count);
    const [commentsCount, setCommentsCount] = useState(initialPost.comments_count);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleLike = async () => {
        handleAuthAction(async () => {
            // Optimistic update
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

            try {
                const result = await api.likePost(post.id);
                if (result.status === 'liked' && !newIsLiked) {
                    setIsLiked(true);
                    setLikesCount(prev => prev + 1);
                } else if (result.status === 'unliked' && newIsLiked) {
                    setIsLiked(false);
                    setLikesCount(prev => prev - 1);
                }
            } catch (error) {
                setIsLiked(!newIsLiked);
                setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
                console.error("Failed to like post:", error);
            }
        });
    };

    const toggleComments = async () => {
        if (!showComments) {
            setShowComments(true);
            if (comments.length === 0) {
                setIsLoadingComments(true);
                try {
                    const fetchedComments = await api.getComments(post.id);
                    setComments(fetchedComments);
                } catch (error) {
                    console.error("Failed to fetch comments:", error);
                } finally {
                    setIsLoadingComments(false);
                }
            }
        } else {
            setShowComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        handleAuthAction(async () => {
            try {
                const comment = await api.addComment(post.id, newComment);
                setComments([comment, ...comments]);
                setCommentsCount(prev => prev + 1);
                setNewComment("");
            } catch (error) {
                console.error("Failed to add comment:", error);
            }
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:bg-slate-900/80 transition-colors"
        >
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    {post.author.profile_picture ? (
                        <img src={post.author.profile_picture.startsWith('http') ? post.author.profile_picture : `http://127.0.0.1:8000${post.author.profile_picture}`} alt={post.author.username} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {post.author.first_name?.[0] || post.author.username[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-bold text-slate-200 truncate">{post.author.first_name} {post.author.last_name}</span>
                            {post.author.is_verified && <BadgeCheck className="h-4 w-4 text-blue-400 flex-shrink-0" />}
                            <span className="text-slate-500 text-sm truncate">@{post.author.username}</span>
                            <span className="text-slate-600 text-sm flex-shrink-0">· {formatTime(post.created_at)}</span>
                        </div>
                        <button className="text-slate-500 hover:text-slate-300">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-slate-300 mb-3 whitespace-pre-wrap leading-relaxed break-words">
                        {post.content}
                    </p>

                    {post.images && post.images.length > 0 && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-slate-800">
                            <img
                                src={post.images[0].image.startsWith('http') ? post.images[0].image : `http://127.0.0.1:8000${post.images[0].image}`}
                                alt="Post content"
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between text-slate-500 max-w-md pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`hover:text-blue-400 gap-2 pl-0 ${showComments ? 'text-blue-400' : ''}`}
                            onClick={toggleComments}
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>{commentsCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`hover:text-pink-500 gap-2 ${isLiked ? 'text-pink-500' : ''}`}
                            onClick={handleLike}
                        >
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                animate={isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            </motion.div>
                            <span>{likesCount}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:text-green-400 gap-2">
                            <Share2 className="h-5 w-5" />
                            <span>Share</span>
                        </Button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                                    {/* Add Comment Form */}
                                    {isAuthenticated && (
                                        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-slate-500 rounded-full" />
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 bg-slate-800/50 border-none rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-600"
                                                />
                                                <Button type="submit" size="icon" className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white" disabled={!newComment.trim()}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Comments List */}
                                    {isLoadingComments ? (
                                        <div className="flex justify-center py-4">
                                            <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                                        </div>
                                    ) : comments.length > 0 ? (
                                        <div className="space-y-4">
                                            {comments.map((comment) => (
                                                <CommentItem
                                                    key={comment.id}
                                                    comment={comment}
                                                    postId={post.id}
                                                    handleAuthAction={handleAuthAction}
                                                    onDelete={(id) => {
                                                        setComments(comments.filter(c => c.id !== id));
                                                        setCommentsCount(prev => prev - 1);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-slate-600 text-sm py-4">No comments yet. Be the first!</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CommentItemProps {
    comment: Comment;
    postId: number;
    handleAuthAction: (action: () => void) => void;
    onDelete: (id: number) => void;
}

function CommentItem({ comment, postId, handleAuthAction, onDelete }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
    const { user } = useAuth();

    // Check if current user is author (using id from auth context vs author.id)
    const isAuthor = user?.id === comment.author.id;

    const handleUpdate = async () => {
        if (!editContent.trim()) return;
        try {
            const updated = await api.updateComment(comment.id, editContent);
            comment.content = updated.content; // Mutate local prop object or better, parent should update. For now this is OK for display.
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.deleteComment(comment.id);
            onDelete(comment.id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        handleAuthAction(async () => {
            try {
                const newReply = await api.replyToComment(postId, comment.id, replyContent);
                setReplies([...replies, newReply]);
                setReplyContent("");
                setIsReplying(false);
            } catch (error) {
                console.error("Failed to reply:", error);
            }
        });
    };

    const formatContent = (content: string) => {
        // Highlight mentions (simple regex)
        const parts = content.split(/(@\w+)/g);
        return parts.map((part, i) => {
            if (part.match(/^@\w+$/)) {
                return <span key={i} className="text-blue-400 font-medium cursor-pointer hover:underline">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="flex gap-3">
            <div className="flex-shrink-0">
                {comment.author.profile_picture ? (
                    <img src={comment.author.profile_picture.startsWith('http') ? comment.author.profile_picture : `http://127.0.0.1:8000${comment.author.profile_picture}`} alt={comment.author.username} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                        {comment.author.first_name?.[0] || comment.author.username[0].toUpperCase()}
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-slate-800/30 rounded-2xl rounded-tl-none p-3 inline-block min-w-[200px] w-full">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-300">{comment.author.first_name} {comment.author.last_name}</span>
                            <span className="text-xs text-slate-600">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        {isAuthor && (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(!isEditing)} className="text-slate-500 hover:text-blue-400 transition-colors">
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="text-slate-500 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-slate-900 border-slate-800">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-slate-100">Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-slate-400">
                                                This action cannot be undone. This will permanently delete your comment.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-7 text-xs">Cancel</Button>
                                <Button size="sm" onClick={handleUpdate} className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white">Save</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">{formatContent(comment.content)}</p>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-1 ml-2">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs text-slate-500 font-medium hover:text-slate-300 transition-colors flex items-center gap-1"
                    >
                        <Reply className="w-3 h-3" /> Reply
                    </button>
                    {replies.length > 0 && (
                        <span className="text-xs text-slate-600">{replies.length} replies</span>
                    )}
                </div>

                <AnimatePresence>
                    {isReplying && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleReply}
                            className="mt-2 flex gap-2"
                        >
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to @${comment.author.username}...`}
                                className="flex-1 bg-slate-800/20 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                autoFocus
                            />
                            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white h-auto py-1.5">
                                <Send className="w-3 h-3" />
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Recursive Replies */}
                {replies.length > 0 && (
                    <div className="mt-3 ml-4 border-l-2 border-slate-800 pl-4 space-y-3">
                        {replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                handleAuthAction={handleAuthAction}
                                onDelete={(id) => setReplies(replies.filter(r => r.id !== id))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
