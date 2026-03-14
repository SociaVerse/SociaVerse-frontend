"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Eye,
  FileText, Download, BookOpen, GraduationCap, User, Send,
  MoreVertical, Trash2, Clock
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { studyhubApi, StudyNote, NoteComment } from "@/services/studyhub"

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const [note, setNote] = useState<StudyNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<NoteComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteData, commentsData] = await Promise.all([
          studyhubApi.getNote(Number(id)),
          studyhubApi.getComments(Number(id)),
        ])
        setNote(noteData)
        setComments(commentsData)
      } catch (err) {
        console.error("Failed:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleLike = async () => {
    if (!isAuthenticated || !note) { router.push("/login"); return }
    try {
      const res = await studyhubApi.likeNote(note.id)
      setNote({
        ...note,
        is_liked: res.status === "liked",
        likes_count: note.likes_count + (res.status === "liked" ? 1 : -1),
      })
    } catch (err) { console.error(err) }
  }

  const handleSave = async () => {
    if (!isAuthenticated || !note) { router.push("/login"); return }
    try {
      const res = await studyhubApi.saveNote(note.id)
      setNote({
        ...note,
        is_saved: res.status === "saved",
        saves_count: note.saves_count + (res.status === "saved" ? 1 : -1),
      })
    } catch (err) { console.error(err) }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: note?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleComment = async () => {
    if (!isAuthenticated || !note || !newComment.trim()) return
    setSubmitting(true)
    try {
      const comment = await studyhubApi.addComment(note.id, newComment.trim())
      setComments(prev => [comment, ...prev])
      setNewComment("")
      setNote({ ...note, comments_count: note.comments_count + 1 })
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const handleDeleteNote = async () => {
    if (!note) return
    if (!window.confirm("Are you sure you want to delete this note?")) return
    try {
      await studyhubApi.deleteNote(note.id)
      router.push("/studyhub")
    } catch (err) { console.error(err) }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await studyhubApi.deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      if (note) setNote({ ...note, comments_count: note.comments_count - 1 })
    } catch (err) { console.error(err) }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex flex-col items-center justify-center">
        <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Note not found</h2>
        <Link href="/studyhub" className="text-red-400 hover:text-red-300 transition-colors">← Back to Study Hub</Link>
      </div>
    )
  }

  const isAuthor = user?.id === note.author.id

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-24">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link href="/studyhub" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Study Hub
          </Link>
        </motion.div>

        {/* Note Content */}
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            {/* PDF indicator */}
            {note.pdf_url && (
              <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
            )}

            <div className="p-6 sm:p-8">
              {/* Tags row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                  {note.subject}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  Sem {note.semester}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">
                  {note.branch.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
                {note.title}
              </h1>

              {/* Author bar */}
              <div className="flex items-center justify-between py-4 mb-6 border-y border-slate-800/50">
                <Link href={`/u/${note.author.username}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 overflow-hidden ring-2 ring-slate-800 group-hover:ring-red-500/50 transition-all">
                    {note.author.profile_picture ? (
                      <img src={note.author.profile_picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                      {note.author.first_name} {note.author.last_name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{timeAgo(note.created_at)}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {note.views} views</span>
                      {note.content && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {getReadingTime(note.content)}</span>}
                    </div>
                  </div>
                </Link>

                {isAuthor && (
                  <button onClick={handleDeleteNote} className="text-slate-500 hover:text-red-400 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* College */}
              {note.college && (
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                  <GraduationCap className="w-4 h-4 text-red-400" />
                  {note.college}
                </div>
              )}

              {/* PDF Section */}
              {note.pdf_url && (
                <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{note.pdf_name || "Study Material PDF"}</p>
                        {note.pdf_size > 0 && (
                          <p className="text-xs text-slate-500">{formatFileSize(note.pdf_size)}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={note.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium border border-red-500/20"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>

                  {/* PDF Preview iframe */}
                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-700/50 bg-black/50">
                    <iframe
                      src={`${note.pdf_url}#toolbar=0`}
                      className="w-full h-[500px] sm:h-[600px]"
                      title="PDF Preview"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              {note.content && (
                <div className="prose prose-invert prose-red max-w-none mb-6 prose-headings:text-white prose-p:text-slate-300 prose-a:text-red-400 prose-strong:text-white prose-code:text-red-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-slate-700 prose-ul:text-slate-300 prose-ol:text-slate-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                </div>
              )}

              {/* Actions bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-4">
                  <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium transition-all ${note.is_liked ? "text-red-400" : "text-slate-400 hover:text-red-400"}`}>
                    <Heart className={`w-5 h-5 ${note.is_liked ? "fill-current" : ""}`} />
                    {note.likes_count}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <MessageCircle className="w-5 h-5" />
                    {note.comments_count}
                  </button>
                  <button onClick={handleSave} className={`flex items-center gap-2 text-sm font-medium transition-all ${note.is_saved ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"}`}>
                    <Bookmark className={`w-5 h-5 ${note.is_saved ? "fill-current" : ""}`} />
                    {note.saves_count}
                  </button>
                </div>
                <button onClick={handleShare} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-red-400" />
              Comments ({note.comments_count})
            </h2>

            {/* Add comment */}
            {isAuthenticated ? (
              <div className="flex gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex-shrink-0 overflow-hidden">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-all"
                    id="note-comment-input"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-xl text-center">
                <p className="text-sm text-slate-400">
                  <Link href="/login" className="text-red-400 hover:text-red-300">Log in</Link> to comment
                </p>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3 group">
                  <Link href={`/u/${comment.author.username}`} className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden">
                      {comment.author.profile_picture ? (
                        <img src={comment.author.profile_picture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/u/${comment.author.username}`} className="text-sm font-semibold text-white hover:text-red-400 transition-colors">
                        {comment.author.first_name || comment.author.username}
                      </Link>
                      <span className="text-xs text-slate-600">{timeAgo(comment.created_at)}</span>
                      {comment.is_author && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-auto opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-slate-600 text-sm py-6">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
