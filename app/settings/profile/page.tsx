"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/custom-toast"
import { Switch } from "@/components/ui/switch"
import {
    Loader2, Camera, Instagram, Twitter, Linkedin, Github, Globe, MapPin,
    User as UserIcon, Calendar, Save, Lock, School, Briefcase, X,
    Plus, Heart, Sparkles, Smile, MessageCircle,
    BadgeCheck, UserPlus, MessageSquare, Check, Users, Zap, Music, Target
} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ImageCropper } from "@/components/ui/image-cropper"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfileSettingsPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    // Basic Form State
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        location: "",
        website: "",
        dob: "",
        college: "",
        bio: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        github: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Validation State
    const [originalUsername, setOriginalUsername] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    
    // College Autocomplete State
    const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([])
    const [isSearchingCollege, setIsSearchingCollege] = useState(false)
    const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false)
    const [wasCollegeSelected, setWasCollegeSelected] = useState(false)

    const [gender, setGender] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [showPrivacyConfirm, setShowPrivacyConfirm] = useState(false)

    // File Uploads
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)

    // Cropper State
    const [cropDialogOpen, setCropDialogOpen] = useState(false)
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
    const [cropType, setCropType] = useState<'avatar' | 'banner' | null>(null)
    const [portfolio, setPortfolio] = useState<any[]>([])
    
    // New Profile Enhancement State
    const [interests, setInterests] = useState<string[]>([])
    const [personalityType, setPersonalityType] = useState("")
    const [mbti, setMbti] = useState("")
    const [vibeTags, setVibeTags] = useState<string[]>([])
    
    // Wave 2 State
    const [relationshipStatus, setRelationshipStatus] = useState("")
    const [zodiacSign, setZodiacSign] = useState("")
    const [lookingFor, setLookingFor] = useState<string[]>([])
    const [statusEmoji, setStatusEmoji] = useState("")
    const [statusText, setStatusText] = useState("")
    const [languages, setLanguages] = useState<string[]>([])
    
    const musicRef = useRef<HTMLInputElement>(null)
    const movieRef = useRef<HTMLInputElement>(null)
    const bucketRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
    const peevesRef = useRef<HTMLInputElement>(null)
    const quoteRef = useRef<HTMLInputElement>(null)
    const obsessionRef = useRef<HTMLInputElement>(null)
    const skillRef = useRef<HTMLInputElement>(null)

    const INTEREST_OPTIONS = [
        "Gaming", "Coding", "Music", "Movies", "Photography", "Fitness", 
        "Reading", "Travel", "Startups", "AI / Technology", "Art / Design", 
        "Psychology", "Entrepreneurship", "Sports", "Anime", "Memes", "Content Creation"
    ]

    const VIBE_OPTIONS = [
        "🚀 Builder", "🎓 Student", "💻 Developer", "🎮 Gamer", "🎨 Creator", 
        "🤖 Tech Nerd", "🌍 Traveler", "💡 Entrepreneur", "🎬 Movie Buff", "📚 Learner"
    ]

    const MBTI_OPTIONS = [
        "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP",
        "Skip"
    ]

const RELATIONSHIP_OPTIONS = [
    "Single", "In a Relationship", "Married", "It’s Complicated", "Open to Anything"
]

const ZODIAC_OPTIONS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

const LOOKING_FOR_OPTIONS = [
    "Networking", "New Friends", "Collaboration", "Gaming Buddies", "Hiring", "Hireaable", "Casual Chat"
]

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile()
        }
    }, [isAuthenticated])

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()

                // Set form state
                setOriginalUsername(data.username || "")
                setFormData({
                    fullName: `${data.first_name} ${data.last_name}`.trim(),
                    username: data.username || "",
                    bio: data.bio || "",
                    location: data.location || "",
                    website: data.website || "",
                    dob: data.date_of_birth || "",
                    college: data.college || "",
                    twitter: data.social_links?.twitter || "",
                    instagram: data.social_links?.instagram || "",
                    linkedin: data.social_links?.linkedin || "",
                    github: data.social_links?.github || ""
                })

                setGender(data.gender || "")
                setIsPrivate(data.is_private || false)
                setAvatarPreview(data.profile_picture)
                setBannerPreview(data.banner_image)
                setPortfolio(data.portfolio || [])
                
                // New Fields
                setInterests(data.interests || [])
                setPersonalityType(data.personality_type || "")
                setMbti(data.mbti || "")
                setVibeTags(data.vibe_tags || [])
                
                setRelationshipStatus(data.relationship_status || "")
                setZodiacSign(data.zodiac_sign || "")
                setLookingFor(data.looking_for || [])
                setStatusEmoji(data.status_emoji || "")
                setStatusText(data.status_text || "")
                setLanguages(data.languages_spoken || [])
                
                if (musicRef.current) musicRef.current.value = JSON.stringify(data.top_music || {})
                if (movieRef.current) movieRef.current.value = (data.favorite_movies || []).join(", ")
                data.bucket_list?.forEach((item: string, i: number) => {
                    if (bucketRefs[i].current) bucketRefs[i].current.value = item
                })
                if (peevesRef.current) peevesRef.current.value = (data.pet_peeves || []).join(", ")
                if (quoteRef.current) quoteRef.current.value = data.favorite_quote || ""
                if (obsessionRef.current) obsessionRef.current.value = data.currently_obsessed_with || ""
                if (skillRef.current) skillRef.current.value = data.random_skill || ""

            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast({ title: "Error", message: "Failed to load profile data", type: "error" })
        } finally {
            setFetching(false)
        }
    }

    // Username Availability Check (Debounced)
    useEffect(() => {
        const checkUsername = async () => {
            const username = formData.username.trim()
            if (username.length < 3 || username === originalUsername) {
                setUsernameAvailable(null)
                return
            }

            setIsCheckingUsername(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/check-username/?username=${username.toLowerCase()}`)
                const data = await response.json()
                if (response.ok) {
                    setUsernameAvailable(data.available)
                } else {
                    setUsernameAvailable(null)
                }
            } catch (error) {
                console.error("Error checking username:", error)
                setUsernameAvailable(null)
            } finally {
                setIsCheckingUsername(false)
            }
        }

        const timeoutId = setTimeout(checkUsername, 500)
        return () => clearTimeout(timeoutId)
    }, [formData.username, originalUsername])

    // College Search (Debounced)
    useEffect(() => {
        if (wasCollegeSelected) {
            setWasCollegeSelected(false)
            return
        }

        const searchColleges = async () => {
            const query = formData.college.trim()
            if (query.length < 2) {
                setCollegeSuggestions([])
                setShowCollegeSuggestions(false)
                return
            }

            setIsSearchingCollege(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/colleges/search/?q=${encodeURIComponent(query)}`)
                const data = await response.json()
                if (response.ok) {
                    setCollegeSuggestions(data)
                    setShowCollegeSuggestions(data.length > 0)
                }
            } catch (error) {
                console.error("Error searching colleges:", error)
            } finally {
                setIsSearchingCollege(false)
            }
        }

        const timeoutId = setTimeout(searchColleges, 300)
        return () => clearTimeout(timeoutId)
    }, [formData.college, wasCollegeSelected])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                setCropImageSrc(reader.result?.toString() || null)
                setCropType(type)
                setCropDialogOpen(true)
            })
            reader.readAsDataURL(file)

            // Reset input so the same file can be selected again if cancelled
            e.target.value = ''
        }
    }

    const handleCropComplete = (croppedFile: File) => {
        const previewUrl = URL.createObjectURL(croppedFile)
        if (cropType === 'avatar') {
            setAvatarFile(croppedFile)
            setAvatarPreview(previewUrl)
        } else if (cropType === 'banner') {
            setBannerFile(croppedFile)
            setBannerPreview(previewUrl)
        }
        setCropDialogOpen(false)
        setCropImageSrc(null)
        setCropType(null)
    }

    const handlePrivacyToggle = (checked: boolean) => {
        if (checked) {
            setShowPrivacyConfirm(true)
        } else {
            updatePrivacy(false)
        }
    }

    const confirmPrivacy = () => {
        setShowPrivacyConfirm(false)
        updatePrivacy(true)
    }

    const updatePrivacy = async (newVal: boolean) => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const formData = new FormData()
            formData.append('is_private', newVal ? 'true' : 'false') // FormData needs string

            // We can also use JSON if backend supports partially, but here existing handleSubmit uses FormData
            // Let's stick to FormData for consistency or PATCH specific field?
            // Since existing PATCH endpoint checks for fields in request.data, it should be fine.

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            })

            if (response.ok) {
                setIsPrivate(newVal)
                toast({ title: "Updated", message: `Account is now ${newVal ? 'Private' : 'Public'}`, type: "success" })
            } else {
                toast({ title: "Error", message: "Failed to update privacy settings", type: "error" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", message: "Network error", type: "error" })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const submitData = new FormData()

            // Basic Info
            const fullName = formData.fullName || ""
            const [firstName, ...lastNameParts] = fullName.split(' ')
            submitData.append('first_name', firstName || "")
            submitData.append('last_name', lastNameParts.join(' ') || "")

            if (formData.username && formData.username !== originalUsername) {
                if (usernameAvailable === false) {
                    toast({ title: "Error", message: "Username is already taken.", type: "error" })
                    setLoading(false)
                    return
                }
                submitData.append('username', formData.username)
            }

            if (formData.bio) submitData.append('bio', formData.bio)
            if (formData.location) submitData.append('location', formData.location)
            if (formData.website) submitData.append('website', formData.website)
            if (formData.dob) submitData.append('date_of_birth', formData.dob)
            if (formData.college) submitData.append('college', formData.college)
            if (gender) submitData.append('gender', gender)

            // Files
            if (avatarFile) submitData.append('profile_picture', avatarFile)
            if (bannerFile) submitData.append('banner_image', bannerFile)

            // Social Links
            const socialLinks = {
                twitter: formData.twitter,
                instagram: formData.instagram,
                linkedin: formData.linkedin,
                github: formData.github,
            }
            submitData.append('social_links', JSON.stringify(socialLinks))
            submitData.append('portfolio', JSON.stringify(portfolio))
            
            // New Fields
            submitData.append('interests', JSON.stringify(interests))
            submitData.append('vibe_tags', JSON.stringify(vibeTags))
            if (personalityType) submitData.append('personality_type', personalityType)
            if (mbti) submitData.append('mbti', mbti)
            if (quoteRef.current?.value !== undefined) submitData.append('favorite_quote', quoteRef.current.value)
            submitData.append('currently_obsessed_with', obsessionRef.current?.value || "")
            submitData.append('random_skill', skillRef.current?.value || "")
            
            submitData.append('relationship_status', relationshipStatus)
            submitData.append('zodiac_sign', zodiacSign)
            submitData.append('looking_for', JSON.stringify(lookingFor))
            submitData.append('status_emoji', statusEmoji)
            submitData.append('status_text', statusText)
            submitData.append('languages_spoken', JSON.stringify(languages))
            
            try {
                const musicData = musicRef.current?.value ? JSON.parse(musicRef.current.value) : {}
                submitData.append('top_music', JSON.stringify(musicData))
            } catch(e) { submitData.append('top_music', JSON.stringify({})) }
            
            const movies = movieRef.current?.value.split(",").map(m => m.trim()).filter(Boolean) || []
            submitData.append('favorite_movies', JSON.stringify(movies))
            
            const bucket = bucketRefs.map(r => r.current?.value || "").filter(Boolean)
            submitData.append('bucket_list', JSON.stringify(bucket))
            
            const peeves = peevesRef.current?.value.split(",").map(p => p.trim()).filter(Boolean) || []
            submitData.append('pet_peeves', JSON.stringify(peeves))

            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: submitData
            })

            if (response.ok) {
                toast({ title: "Success", message: "Profile updated successfully!", type: "success" })
                // Refresh data to ensure consistency
                fetchProfile()
            } else {
                const errorData = await response.json()
                console.error("Profile Update Error Details:", JSON.stringify(errorData, null, 2))
                
                // Show a more specific toast if it's a validation error
                const errorValues = Object.values(errorData);
                let errorMessage = "Failed to update profile";
                if (errorValues.length > 0) {
                    const firstError = errorValues[0];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : (typeof firstError === 'string' ? firstError : JSON.stringify(firstError));
                }
                
                toast({ title: "Error", message: errorMessage, type: "error" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", message: "Network error", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <AlertDialog open={showPrivacyConfirm} onOpenChange={setShowPrivacyConfirm}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Make account private?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Only people you approve can see your photos and videos. Your existing followers won't be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border-slate-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPrivacy} className="bg-blue-600 text-white hover:bg-blue-700">Switch to Private</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                    <p className="text-slate-400 mt-1">Customize how your profile looks to others.</p>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

                {/* Privacy Section */}
                <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-800/50">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 font-semibold text-white">
                                <Lock className="w-4 h-4 text-slate-400" />
                                Private Account
                            </div>
                            <p className="text-sm text-slate-400 max-w-md">
                                When your account is private, only people you approve can see your photos and videos.
                            </p>
                        </div>
                        <Switch
                            checked={isPrivate}
                            onCheckedChange={handlePrivacyToggle}
                        />
                    </div>
                </div>

                {/* Images Section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Banner Image</Label>
                        <div className="relative h-40 rounded-xl overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-slate-500 transition-colors group">
                            <img
                                src={bannerPreview || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000"}
                                alt="Banner"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="text-sm font-medium">Click to upload banner</span>
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e, 'banner')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 group shrink-0">
                                <img
                                    src={avatarPreview || "https://ui-avatars.com/api/?name=User"}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-400">
                                    Recommended: Square JPG, PNG. Max 2MB.
                                </p>
                                <Button variant="outline" size="sm" type="button" className="text-xs">
                                    Remove Photo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid gap-6 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-blue-500" /> Basic Info
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} placeholder="Your Name" className="bg-slate-950/50 border-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative group">
                                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange("username", e.target.value)}
                                    placeholder="your_username"
                                    className={`pl-10 bg-slate-950/50 border-slate-800 ${formData.username && formData.username !== originalUsername ? (usernameAvailable === false ? 'border-red-500/50' : usernameAvailable === true ? 'border-emerald-500/50' : '') : ''}`}
                                />
                                {formData.username && formData.username !== originalUsername && (
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        {isCheckingUsername ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                        ) : usernameAvailable === true ? (
                                            <Check className="h-4 w-4 text-emerald-500" />
                                        ) : usernameAvailable === false ? (
                                            <X className="h-4 w-4 text-red-500" />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            {formData.username && formData.username !== originalUsername && usernameAvailable === false && (
                                <p className="text-[10px] text-red-400">Username is taken</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" value={formData.dob} onChange={(e) => handleInputChange("dob", e.target.value)} className="bg-slate-950/50 border-slate-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="college">College</Label>
                        <div className="relative">
                            <School className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <Input
                                id="college"
                                value={formData.college}
                                onChange={(e) => {
                                    handleInputChange("college", e.target.value)
                                    setShowCollegeSuggestions(true)
                                }}
                                onFocus={() => collegeSuggestions.length > 0 && setShowCollegeSuggestions(true)}
                                className="pl-10 bg-slate-950/50 border-slate-800"
                                placeholder="Your College Name"
                            />
                            {isSearchingCollege && (
                                <div className="absolute inset-y-0 right-3 flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                </div>
                            )}
                        </div>

                        {/* College Suggestions Dropdown */}
                        <AnimatePresence>
                            {showCollegeSuggestions && collegeSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 w-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                                >
                                    {collegeSuggestions.map((name, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setWasCollegeSelected(true)
                                                handleInputChange("college", name)
                                                setCollegeSuggestions([])
                                                setShowCollegeSuggestions(false)
                                            }}
                                            className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            className="bg-slate-950/50 border-slate-800 min-h-[100px] resize-none"
                            placeholder="Tell us a little bit about yourself..."
                        />
                        <p className="text-xs text-slate-500 text-right">{formData.bio.length}/160</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="City, Country" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                id="gender"
                                value={gender} // Controlled input
                                onChange={(e) => setGender(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-200"
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                                <option value="N">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="grid gap-6 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-500" /> Social Links
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="website" value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="https://yourwebsite.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="twitter" value={formData.twitter} onChange={(e) => handleInputChange("twitter", e.target.value)} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="instagram" value={formData.instagram} onChange={(e) => handleInputChange("instagram", e.target.value)} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="linkedin" value={formData.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="github">GitHub</Label>
                            <div className="relative">
                                <Github className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="github" value={formData.github} onChange={(e) => handleInputChange("github", e.target.value)} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio Section */}
                <div className="grid gap-6 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50">
                    <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-purple-500" /> Portfolio & Achievements
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPortfolio([...portfolio, { type: 'project', title: '', description: '', link: '', date: '' }])}
                            className="text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                        >
                            + Add Item
                        </Button>
                    </h3>

                    {portfolio.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4 italic">No portfolio items added yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {portfolio.map((item, idx) => (
                                <div key={idx} className="relative p-4 bg-slate-950/50 border border-slate-800 rounded-lg space-y-4">
                                    <button
                                        type="button"
                                        onClick={() => setPortfolio(portfolio.filter((_, i) => i !== idx))}
                                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <select
                                                value={item.type}
                                                onChange={(e) => {
                                                    const newPortfolio = [...portfolio];
                                                    newPortfolio[idx].type = e.target.value;
                                                    setPortfolio(newPortfolio);
                                                }}
                                                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                                            >
                                                <option value="project">Project</option>
                                                <option value="certification">Certification</option>
                                                <option value="badge">Badge/Award</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Date (Year/Term)</Label>
                                            <Input
                                                value={item.date}
                                                onChange={(e) => {
                                                    const newPortfolio = [...portfolio];
                                                    newPortfolio[idx].date = e.target.value;
                                                    setPortfolio(newPortfolio);
                                                }}
                                                placeholder="e.g. 2024 or Fall 2023"
                                                className="bg-slate-900 border-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => {
                                                const newPortfolio = [...portfolio];
                                                newPortfolio[idx].title = e.target.value;
                                                setPortfolio(newPortfolio);
                                            }}
                                            placeholder="Item Title"
                                            className="bg-slate-900 border-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={item.description}
                                            onChange={(e) => {
                                                const newPortfolio = [...portfolio];
                                                newPortfolio[idx].description = e.target.value;
                                                setPortfolio(newPortfolio);
                                            }}
                                            placeholder="Short description..."
                                            className="bg-slate-900 border-slate-800 h-20 resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Link (URL)</Label>
                                        <Input
                                            value={item.link}
                                            onChange={(e) => {
                                                const newPortfolio = [...portfolio];
                                                newPortfolio[idx].link = e.target.value;
                                                setPortfolio(newPortfolio);
                                            }}
                                            placeholder="https://..."
                                            className="bg-slate-900 border-slate-800"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* About Section Enhancements */}
                <div className="grid gap-8 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" /> About & Personality
                    </h3>

                    {/* Interests */}
                    <div className="space-y-4">
                        <Label>Interests / Hobbies (Select 3-10)</Label>
                        <div className="flex flex-wrap gap-2">
                            {INTEREST_OPTIONS.map(interest => {
                                const isSelected = interests.includes(interest);
                                return (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setInterests(interests.filter(i => i !== interest));
                                            } else if (interests.length < 10) {
                                                setInterests([...interests, interest]);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            isSelected 
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                                        }`}
                                    >
                                        {interest}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500">Selected: {interests.length}/10</p>
                    </div>

                    {/* Personality & MBTI */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="personality">Personality Type</Label>
                            <select
                                id="personality"
                                value={personalityType}
                                onChange={(e) => setPersonalityType(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200"
                            >
                                <option value="">Select personality</option>
                                <option value="Introvert">Introvert</option>
                                <option value="Extrovert">Extrovert</option>
                                <option value="Ambivert">Ambivert</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mbti">MBTI Personality</Label>
                            <select
                                id="mbti"
                                value={mbti}
                                onChange={(e) => setMbti(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200"
                            >
                                <option value="">Select MBTI (Optional)</option>
                                {MBTI_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Vibe Tags */}
                    <div className="space-y-4">
                        <Label>Vibe / Identity Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {VIBE_OPTIONS.map(tag => {
                                const isSelected = vibeTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setVibeTags(vibeTags.filter(t => t !== tag));
                                            } else {
                                                setVibeTags([...vibeTags, tag]);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            isSelected 
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quote, Obsession, Skill */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="quote">Favorite Quote</Label>
                            <div className="relative">
                                <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="quote" ref={quoteRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="“Stay hungry, stay foolish.”" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="obsession">Currently Obsessed With</Label>
                                <div className="relative">
                                    <Heart className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <Input id="obsession" ref={obsessionRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="AI tools, football, etc." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skill">Random Skill</Label>
                                <div className="relative">
                                    <Smile className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <Input id="skill" ref={skillRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Solving Rubik’s cubes..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social & Lifestyle */}
                <div className="grid gap-8 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 mt-8">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Social & Lifestyle
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship Status</Label>
                            <select
                                id="relationship"
                                value={relationshipStatus}
                                onChange={(e) => setRelationshipStatus(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200"
                            >
                                <option value="">Select status</option>
                                {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zodiac">Zodiac Sign</Label>
                            <select
                                id="zodiac"
                                value={zodiacSign}
                                onChange={(e) => setZodiacSign(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200"
                            >
                                <option value="">Select sign</option>
                                {ZODIAC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Looking For</Label>
                        <div className="flex flex-wrap gap-2">
                            {LOOKING_FOR_OPTIONS.map(opt => {
                                const isSelected = lookingFor.includes(opt);
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) setLookingFor(lookingFor.filter(i => i !== opt));
                                            else setLookingFor([...lookingFor, opt]);
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            isSelected 
                                            ? "bg-emerald-600 text-white shadow-lg" 
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Status & interaction */}
                <div className="grid gap-8 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 mt-8">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" /> Status & Interaction
                    </h3>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Status Emoji</Label>
                            <Input 
                                value={statusEmoji} 
                                onChange={(e) => setStatusEmoji(e.target.value)}
                                placeholder="e.g. ☕"
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label>Status Message</Label>
                            <Input 
                                value={statusText} 
                                onChange={(e) => setStatusText(e.target.value)}
                                placeholder="What are you up to?"
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Bucket List (Top 3)</Label>
                        <div className="space-y-3">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-slate-500 font-bold">{i + 1}.</span>
                                    <Input 
                                        ref={bucketRefs[i]}
                                        placeholder="I want to..."
                                        className="bg-slate-950/50 border-slate-800"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Pet Peeves (Comma separated)</Label>
                        <Input 
                            ref={peevesRef}
                            placeholder="Slow Wi-Fi, Cold coffee..."
                            className="bg-slate-950/50 border-slate-800"
                        />
                    </div>
                </div>

                {/* Taste & Preferences */}
                <div className="grid gap-8 p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 mt-8">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Music className="w-5 h-5 text-purple-500" /> Taste & Preferences
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Music Taste</Label>
                            <Input 
                                ref={musicRef}
                                placeholder='Artists or Genres (JSON format)'
                                className="bg-slate-950/50 border-slate-800"
                            />
                            <p className="text-[10px] text-slate-500">e.g. {"{ \"Artists\": [\"Lana Del Rey\"] }"}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Favorite Movies / Shows (Comma separated)</Label>
                            <Input 
                                ref={movieRef}
                                placeholder="Inception, Breaking Bad..."
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        <div className="space-y-4">
                            <Label>Languages Spoken</Label>
                            <div className="flex flex-wrap gap-2">
                                {["English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese"].map(lang => {
                                    const isSelected = languages.includes(lang);
                                    return (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => {
                                                if (isSelected) setLanguages(languages.filter(l => l !== lang));
                                                else setLanguages([...languages, lang]);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                isSelected 
                                                ? "bg-slate-200 text-slate-900" 
                                                : "bg-slate-800 text-slate-400 hover:text-slate-200"
                                            }`}
                                        >
                                            {lang}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </form>

            
            {cropImageSrc && cropType && (
                <ImageCropper
                    open={cropDialogOpen}
                    imageSrc={cropImageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setCropDialogOpen(false)
                        setCropImageSrc(null)
                        setCropType(null)
                    }}
                    aspectRatio={cropType === 'avatar' ? 1 : 3}
                />
            )}
        </div>
    )
}
