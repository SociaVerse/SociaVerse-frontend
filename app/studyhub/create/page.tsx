"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Upload, FileText, X, Sparkles,
  BookOpen, Eye, EyeOff, Send, AlertCircle
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useAuth } from "@/components/auth-provider"
import { studyhubApi } from "@/services/studyhub"
import { VisibilitySelector } from "@/components/visibility-selector"

const BRANCHES = [
  { value: "cse", label: "Computer Science (CSE)" },
  { value: "ece", label: "Electronics (ECE)" },
  { value: "eee", label: "Electrical (EEE)" },
  { value: "me", label: "Mechanical (ME)" },
  { value: "ce", label: "Civil (CE)" },
  { value: "it", label: "Information Technology (IT)" },
  { value: "aids", label: "AI & Data Science" },
  { value: "aiml", label: "AI & Machine Learning" },
  { value: "other", label: "Other" },
]

const MAX_PDF_SIZE = 20 * 1024 * 1024 // 20 MB

export default function CreateNotePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [branch, setBranch] = useState("cse")
  const [semester, setSemester] = useState("1")
  const [content, setContent] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfError, setPdfError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [visibility, setVisibility] = useState<"university" | "global">("global")

  const handlePdfSelect = (file: File | null) => {
    setPdfError("")
    if (!file) { setPdfFile(null); return }

    if (file.type !== "application/pdf") {
      setPdfError("Only PDF files are allowed")
      return
    }
    if (file.size > MAX_PDF_SIZE) {
      setPdfError("File size must be under 20 MB")
      return
    }
    setPdfFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handlePdfSelect(file)
  }

  const handleSubmit = async () => {
    setError("")

    if (!title.trim()) { setError("Title is required"); return }
    if (!subject.trim()) { setError("Subject is required"); return }
    if (!content.trim() && !pdfFile) { setError("Add note content or upload a PDF"); return }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("subject", subject.trim())
      formData.append("branch", branch)
      formData.append("semester", semester)
      formData.append("content", content)
      if (pdfFile) {
        formData.append("uploaded_pdf", pdfFile)
      }
      formData.append("visibility", visibility)

      const note = await studyhubApi.createNote(formData)
      router.push(`/studyhub/${note.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create note")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex flex-col items-center justify-center">
        <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
        <p className="text-slate-400 mb-4">You need to be logged in to share notes.</p>
        <Link href="/login" className="text-red-400 hover:text-red-300">Go to Login →</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-24">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link href="/studyhub" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Study Hub
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-red-500/10 border border-red-500/20">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400 font-medium">Share Knowledge</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Share a <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Study Note</span>
          </h1>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DBMS Normalization Quick Notes"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                id="create-note-title"
              />
            </div>

            {/* Subject + Branch row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Database Management"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-all"
                  id="create-note-subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-red-500/50 transition-all"
                  id="create-note-branch"
                >
                  {BRANCHES.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Semester</label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(s => (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${semester === s
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                      }`}
                  >
                    Sem {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Content {!pdfFile && "*"} <span className="text-xs text-slate-500">(Markdown supported)</span>
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPreview ? "Edit" : "Preview"}
                </button>
              </div>
              {showPreview ? (
                <div className="min-h-[200px] p-4 bg-slate-800 border border-slate-700 rounded-xl prose prose-invert prose-red prose-sm max-w-none">
                  {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  ) : (
                    <p className="text-slate-500 italic">Nothing to preview yet...</p>
                  )}
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your notes here... Use Markdown for formatting: # headings, **bold**, - lists, ```code blocks```"
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-all resize-y font-mono text-sm leading-relaxed"
                  id="create-note-content"
                />
              )}
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                PDF Upload <span className="text-xs text-slate-500">(max 20 MB)</span>
              </label>

              {pdfFile ? (
                <div className="flex items-center justify-between p-4 bg-slate-800 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{pdfFile.name}</p>
                      <p className="text-xs text-slate-500">{(pdfFile.size / 1048576).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setPdfFile(null)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-700 hover:border-red-500/30 rounded-xl p-8 text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-8 h-8 text-slate-600 group-hover:text-red-400 mx-auto mb-2 transition-colors" />
                  <p className="text-sm text-slate-400">
                    <span className="text-red-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-600 mt-1">PDF only • Max 20 MB</p>
                </div>
              )}

              {pdfError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {pdfError}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handlePdfSelect(e.target.files?.[0] || null)}
                className="hidden"
                id="create-note-pdf-input"
              />
            </div>

            {/* Visibility */}
            <VisibilitySelector value={visibility} onChange={setVisibility} />

            {/* Submit */}
            <div className="pt-4 flex justify-end gap-3">
              <Link
                href="/studyhub"
                className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all font-medium text-sm"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                id="create-note-submit"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish Note
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
