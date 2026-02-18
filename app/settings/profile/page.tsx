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
    User as UserIcon, Calendar, Save, Lock
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

export default function ProfileSettingsPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    // Form Stats
    const bioRef = useRef<HTMLTextAreaElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLInputElement>(null)
    const websiteRef = useRef<HTMLInputElement>(null)
    const dobRef = useRef<HTMLInputElement>(null)

    // Social Links Refs
    const twitterRef = useRef<HTMLInputElement>(null)
    const instagramRef = useRef<HTMLInputElement>(null)
    const linkedinRef = useRef<HTMLInputElement>(null)
    const githubRef = useRef<HTMLInputElement>(null)

    const [gender, setGender] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [showPrivacyConfirm, setShowPrivacyConfirm] = useState(false)

    // File Uploads
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)

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

                // Set default values
                if (nameRef.current) nameRef.current.value = `${data.first_name} ${data.last_name}`.trim()
                if (bioRef.current) bioRef.current.value = data.bio || ""
                if (locationRef.current) locationRef.current.value = data.location || ""
                if (websiteRef.current) websiteRef.current.value = data.website || ""
                if (dobRef.current) dobRef.current.value = data.date_of_birth || ""

                setGender(data.gender || "")
                setIsPrivate(data.is_private || false)
                setAvatarPreview(data.profile_picture)
                setBannerPreview(data.banner_image)

                // Social Links
                const links = data.social_links || {}
                if (twitterRef.current) twitterRef.current.value = links.twitter || ""
                if (instagramRef.current) instagramRef.current.value = links.instagram || ""
                if (linkedinRef.current) linkedinRef.current.value = links.linkedin || ""
                if (githubRef.current) githubRef.current.value = links.github || ""

            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast({ title: "Error", message: "Failed to load profile data", type: "error" })
        } finally {
            setFetching(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0]
        if (file) {
            if (type === 'avatar') {
                setAvatarFile(file)
                setAvatarPreview(URL.createObjectURL(file))
            } else {
                setBannerFile(file)
                setBannerPreview(URL.createObjectURL(file))
            }
        }
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
            const formData = new FormData()

            // Basic Info
            const fullName = nameRef.current?.value || ""
            const [firstName, ...lastNameParts] = fullName.split(' ')
            formData.append('first_name', firstName || "")
            formData.append('last_name', lastNameParts.join(' ') || "")

            if (bioRef.current?.value) formData.append('bio', bioRef.current.value)
            if (locationRef.current?.value) formData.append('location', locationRef.current.value)
            if (websiteRef.current?.value) formData.append('website', websiteRef.current.value)
            if (dobRef.current?.value) formData.append('date_of_birth', dobRef.current.value)
            if (gender) formData.append('gender', gender)

            // Files
            if (avatarFile) formData.append('profile_picture', avatarFile)
            if (bannerFile) formData.append('banner_image', bannerFile)

            // Social Links
            const socialLinks = {
                twitter: twitterRef.current?.value,
                instagram: instagramRef.current?.value,
                linkedin: linkedinRef.current?.value,
                github: githubRef.current?.value,
            }
            formData.append('social_links', JSON.stringify(socialLinks))

            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            })

            if (response.ok) {
                toast({ title: "Success", message: "Profile updated successfully!", type: "success" })
                // Refresh data to ensure consistency
                fetchProfile()
            } else {
                const data = await response.json()
                console.error(data)
                toast({ title: "Error", message: "Failed to update profile", type: "error" })
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
                            <Input id="name" ref={nameRef} placeholder="Your Name" className="bg-slate-950/50 border-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" ref={dobRef} className="bg-slate-950/50 border-slate-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            ref={bioRef}
                            className="bg-slate-950/50 border-slate-800 min-h-[100px] resize-none"
                            placeholder="Tell us a little bit about yourself..."
                        />
                        <p className="text-xs text-slate-500 text-right">0/160</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="location" ref={locationRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="City, Country" />
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
                                <Input id="website" ref={websiteRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="https://yourwebsite.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="twitter" ref={twitterRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="instagram" ref={instagramRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="linkedin" ref={linkedinRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="github">GitHub</Label>
                            <div className="relative">
                                <Github className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input id="github" ref={githubRef} className="pl-10 bg-slate-950/50 border-slate-800" placeholder="Username" />
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
}
