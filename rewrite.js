const fs = require('fs');
const text = fs.readFileSync('D:/SociaVerse/SociaVerse-frontend/sociaverse-frontend/components/post-card.tsx', 'utf-8');

const startIdx = text.indexOf('    return (\n        <motion.div');
const endIdx = text.indexOf('        </motion.div>\n    );\n}');

if (startIdx === -1 || endIdx === -1) {
    console.log('Failed to find boundaries');
    process.exit(1);
}

const newReturn = \    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={\\\reak-inside-avoid mb-4 group bg-[#0b0b0d] rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative \\\\\\}
            onClick={() => onPostClick?.(post)}
        >
            {/* Image Section */}
            {post.images && post.images.length > 0 && (
                <div className="relative flex flex-col group/image">
                    {post.images.map((imgObj, index) => {
                        const imgUrl = imgObj.image.startsWith('http') ? imgObj.image : \\\\\\\\\\\\;
                        return (
                            <Image
                                key={imgObj.id || index}
                                src={imgUrl}
                                alt={\\\Post content \\\\\\}
                                width={0}
                                height={0}
                                sizes="100vw"
                                unoptimized
                                className="w-full h-auto object-contain rounded-xl"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onImageClick?.(imgUrl);
                                }}
                            />
                        );
                    })}

                    {/* Pinterest Hover Overlay on Image */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover/image:opacity-100 transition duration-300 flex items-center justify-center gap-4 z-10 pointer-events-auto rounded-xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all h-12 w-12"
                            onClick={(e) => { e.stopPropagation(); handleLike(); }}
                        >
                            <Heart className={\\\h-6 w-6 \\\\\\} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all h-12 w-12"
                            onClick={(e) => { e.stopPropagation(); toggleComments(); }}
                        >
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all h-12 w-12"
                            onClick={(e) => { e.stopPropagation(); }}
                        >
                            <Bookmark className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="p-4 space-y-3">
                {/* Header / Author */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Link href={\\\/u/\\\\\\} onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                            {post.author.profile_picture ? (
                                <img src={post.author.profile_picture.startsWith('http') ? post.author.profile_picture : \\\\\\\\\\\\} alt={post.author.username} className="w-8 h-8 rounded-full object-cover hover:opacity-90 transition-opacity" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">
                                    {post.author.first_name?.[0] || post.author.username[0].toUpperCase()}
                                </div>
                            )}
                        </Link>
                        <div className="flex flex-col min-w-0">
                            <Link href={\\\/u/\\\\\\} onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-slate-200 text-sm truncate">{post.author.first_name} {post.author.last_name}</span>
                                    {post.author.is_verified && <BadgeCheck className="h-3 w-3 text-blue-400 flex-shrink-0" />}
                                </div>
                                <span className="text-slate-500 text-xs truncate">@{post.author.username} · {formatTime(post.created_at)}</span>
                            </Link>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="text-slate-500 hover:text-slate-300">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                            {isAuthor && onDelete && (
                                <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Post
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer">
                                Report Post
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Delete Dialog */}
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent className="bg-slate-900 border-slate-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-100">Delete Post?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                    This action cannot be undone. This post will be permanently removed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Caption */}
                {post.content && (
                    <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed break-words">
                        {post.content}
                    </p>
                )}

                {/* Mobile interaction strip OR default interaction strip underneath (keeps counts visible) */}
                <div className="flex items-center gap-4 text-slate-500 pt-2 border-t border-slate-800/50 mt-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={handleLike} className={\\\lex items-center gap-1.5 transition-colors text-sm hover:text-pink-500 \\\\\\}>
                        <Heart className={\\\h-4 w-4 \\\\\\} /> {likesCount > 0 ? likesCount : 'Like'}
                    </button>
                    <button onClick={toggleComments} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors text-sm">
                        <MessageCircle className="h-4 w-4" /> {commentsCount > 0 ? commentsCount : 'Comment'}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors text-sm">
                        <Share2 className="h-4 w-4" /> Share
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
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
\;

fs.writeFileSync('D:/SociaVerse/SociaVerse-frontend/sociaverse-frontend/components/post-card.tsx', text.substring(0, startIdx) + newReturn + text.substring(endIdx));
console.log('DONE');
