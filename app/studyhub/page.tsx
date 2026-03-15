"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, BookOpen, FileText, Heart, MessageCircle,
  Bookmark, Eye, Filter, ChevronDown, Flame, Clock,
  ThumbsUp, Star, X, GraduationCap, Sparkles, Globe, MapPin
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { studyhubApi, StudyNote, GetNotesParams } from "@/services/studyhub"

// ── Constants ────────────────────────────────────────────────────────────────

const BRANCHES = [
  { value: "", label: "All Branches" },
  { value: "cse", label: "CSE" },
  { value: "ece", label: "ECE" },
  { value: "eee", label: "EEE" },
  { value: "me", label: "ME" },
  { value: "ce", label: "CE" },
  { value: "it", label: "IT" },
  { value: "aids", label: "AI & DS" },
  { value: "aiml", label: "AI & ML" },
  { value: "other", label: "Other" },
]

const SEMESTERS = [
  { value: "", label: "All Semesters" },
  ...Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Sem ${i + 1}` })),
]

const SORT_OPTIONS = [
  { value: "trending", label: "Trending", icon: Flame },
  { value: "newest", label: "Newest", icon: Clock },
  { value: "most_liked", label: "Most Liked", icon: ThumbsUp },
  { value: "most_saved", label: "Most Saved", icon: Star },
]

// ── Helper ───────────────────────────────────────────────────────────────────

function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

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

// ── Note Card ────────────────────────────────────────────────────────────────

function NoteCard({ note, onLike }: { note: StudyNote; onLike: (id: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 to-red-500/0 group-hover:from-red-600/20 group-hover:to-orange-500/20 rounded-2xl blur-sm transition-all duration-500" />

      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 group-hover:border-red-500/30 rounded-2xl overflow-hidden transition-all duration-300">
        {/* PDF indicator bar */}
        {note.pdf_url && (
          <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-shimmer" />
        )}

        <div className="p-5">
          {/* Header: Author + Time */}
          <div className="flex items-center justify-between mb-3">
            <Link href={`/u/${note.author.username}`} className="flex items-center gap-2.5 group/author">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center overflow-hidden ring-2 ring-slate-800 group-hover/author:ring-red-500/50 transition-all">
                {note.author.profile_picture ? (
                  <img src={note.author.profile_picture} alt={note.author.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">{note.author.first_name?.[0] || note.author.username[0]}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover/author:text-red-400 transition-colors leading-none">
                  {note.author.first_name} {note.author.last_name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{timeAgo(note.created_at)}</p>
              </div>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              {formatCount(note.views)}
            </div>
          </div>

          {/* Title */}
          <Link href={`/studyhub/${note.id}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2 leading-snug">
              {note.title}
            </h3>
          </Link>

          {/* Content preview */}
          {note.content && (
            <p className="text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {note.content.replace(/[#*`_~]/g, '').slice(0, 150)}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
              {note.subject}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
              Sem {note.semester}
            </span>
            {note.branch && (
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">
                {note.branch.toUpperCase()}
              </span>
            )}
          </div>

          {/* PDF badge + reading time */}
          <div className="flex items-center gap-3 mb-4">
            {note.pdf_url && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-red-400 font-medium">PDF</span>
                {note.pdf_size > 0 && (
                  <span className="text-xs text-red-400/60">• {formatFileSize(note.pdf_size)}</span>
                )}
              </div>
            )}
            {note.content && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {getReadingTime(note.content)}
              </span>
            )}
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
            <button
              onClick={(e) => { e.preventDefault(); onLike(note.id) }}
              className={`flex items-center gap-1.5 text-sm transition-all duration-200 ${note.is_liked
                  ? "text-red-400 hover:text-red-300"
                  : "text-slate-500 hover:text-red-400"
                }`}
            >
              <Heart className={`w-4 h-4 ${note.is_liked ? "fill-current" : ""}`} />
              <span>{formatCount(note.likes_count)}</span>
            </button>

            <Link href={`/studyhub/${note.id}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{formatCount(note.comments_count)}</span>
            </Link>

            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Bookmark className={`w-4 h-4 ${note.is_saved ? "fill-current text-yellow-400" : ""}`} />
              <span>{formatCount(note.saves_count)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function NoteCardSkeleton() {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-slate-800" />
        <div className="flex-1">
          <div className="h-3.5 w-24 bg-slate-800 rounded" />
          <div className="h-2.5 w-16 bg-slate-800 rounded mt-1.5" />
        </div>
      </div>
      <div className="h-5 w-3/4 bg-slate-800 rounded mb-2" />
      <div className="h-4 w-full bg-slate-800 rounded mb-1" />
      <div className="h-4 w-2/3 bg-slate-800 rounded mb-3" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-slate-800 rounded-full" />
        <div className="h-6 w-14 bg-slate-800 rounded-full" />
      </div>
      <div className="flex justify-between pt-3 border-t border-slate-800/50">
        <div className="h-4 w-10 bg-slate-800 rounded" />
        <div className="h-4 w-10 bg-slate-800 rounded" />
        <div className="h-4 w-10 bg-slate-800 rounded" />
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function StudyHubPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [notes, setNotes] = useState<StudyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Filters
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [branch, setBranch] = useState("")
  const [semester, setSemester] = useState("")
  const [sort, setSort] = useState<"trending" | "newest" | "most_liked" | "most_saved">("trending")
  const [visibility, setVisibility] = useState<"university" | "global">("university")
  const [pdfOnly, setPdfOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch notes
  const fetchNotes = useCallback(async (pageNum: number, append = false) => {
    setLoading(true)
    try {
      const params: GetNotesParams = {
        page: pageNum,
        sort,
        search: debouncedSearch || undefined,
        branch: branch || undefined,
        semester: semester || undefined,
        pdf_only: pdfOnly || undefined,
        visibility: visibility,
      }
      const data = await studyhubApi.getNotes(params)
      setNotes(prev => append ? [...prev, ...data.results] : data.results)
      setHasMore(!!data.next)
    } catch (err) {
      console.error("Failed to fetch notes:", err)
    } finally {
      setLoading(false)
    }
  }, [sort, debouncedSearch, branch, semester, pdfOnly])

  // Reset and fetch on filter change
  useEffect(() => {
    setPage(1)
    fetchNotes(1)
  }, [fetchNotes, visibility])

  // Load more
  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchNotes(next, true)
  }

  // Like toggle
  const handleLike = async (noteId: number) => {
    if (!isAuthenticated) { router.push("/login"); return }
    try {
      const res = await studyhubApi.likeNote(noteId)
      setNotes(prev => prev.map(n =>
        n.id === noteId
          ? {
            ...n,
            is_liked: res.status === "liked",
            likes_count: n.likes_count + (res.status === "liked" ? 1 : -1),
          }
          : n
      ))
    } catch (err) {
      console.error("Like failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-24">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/3 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-red-500/10 border border-red-500/20">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Student Knowledge Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            Study <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Share notes, PDFs, and exam prep material. Help your college community ace their exams.
          </p>

          {/* Visibility Scope Selector */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl">
              <button
                onClick={() => setVisibility("university")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  visibility === "university"
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MapPin className="w-4 h-4" />
                My University
              </button>
              <button
                onClick={() => setVisibility("global")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  visibility === "global"
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Globe className="w-4 h-4" />
                Global Hub
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search + Create */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes, subjects, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                id="studyhub-search"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(f => !f)}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${showFilters
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              id="studyhub-filter-toggle"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Filters</span>
            </button>

            {isAuthenticated && (
              <Link
                href="/studyhub/create"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:scale-105"
                id="studyhub-create-btn"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Share Note</span>
              </Link>
            )}
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-wrap gap-3">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-red-500/50"
                    id="studyhub-branch-filter"
                  >
                    {BRANCHES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>

                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-red-500/50"
                    id="studyhub-semester-filter"
                  >
                    {SEMESTERS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setPdfOnly(!pdfOnly)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${pdfOnly
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                      }`}
                    id="studyhub-pdf-filter"
                  >
                    <FileText className="w-4 h-4" />
                    PDF Only
                  </button>

                  {(branch || semester || pdfOnly) && (
                    <button
                      onClick={() => { setBranch(""); setSemester(""); setPdfOnly(false) }}
                      className="px-3 py-2 text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sort tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide pb-1"
        >
          {SORT_OPTIONS.map(option => {
            const Icon = option.icon
            const isActive = sort === option.value
            return (
              <button
                key={option.value}
                onClick={() => setSort(option.value as typeof sort)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${isActive
                    ? "bg-red-500/15 text-red-400 border border-red-500/30 shadow-sm"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            )
          })}
        </motion.div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} onLike={handleLike} />
            ))}
          </AnimatePresence>

          {/* Loading skeletons */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={`skel-${i}`} />
          ))}
        </div>

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No notes found</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              {search || branch || semester || pdfOnly
                ? "Try adjusting your filters or search query."
                : "Be the first to share study notes and help your community!"}
            </p>
            {isAuthenticated && (
              <Link
                href="/studyhub/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all"
              >
                <Plus className="w-5 h-5" />
                Share Your First Note
              </Link>
            )}
          </motion.div>
        )}

        {/* Load more */}
        {!loading && hasMore && notes.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-red-500/30 transition-all font-medium"
            >
              Load More Notes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
