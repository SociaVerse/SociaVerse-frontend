"use client"

import { motion } from "framer-motion"
import { 
    Heart, Sparkles, Smile, MessageCircle, 
    Zap, Target, Bookmark, Coffee, Info, Users
} from "lucide-react"

interface ProfileAboutSectionProps {
    profile: {
        bio?: string;
        interests?: string[];
        personality_type?: string;
        mbti?: string;
        vibe_tags?: string[];
        favorite_quote?: string;
        currently_obsessed_with?: string;
        random_skill?: string;
        relationship_status?: string;
        zodiac_sign?: string;
        looking_for?: string[];
        top_music?: { Artists?: string[]; Genres?: string[] };
        favorite_movies?: string[];
        languages_spoken?: string[];
        bucket_list?: string[];
        pet_peeves?: string[];
    }
}

export function ProfileAboutSection({ profile }: ProfileAboutSectionProps) {
    const renderValue = (value: any) => value || <span className="text-slate-600 italic">Not available</span>;

    const sections = [
        {
            title: "Personality & Vibe",
            icon: <Zap className="w-5 h-5 text-yellow-500" />,
            items: [
                { label: "Personality Type", value: profile.personality_type, icon: <Smile className="w-4 h-4" /> },
                { label: "MBTI", value: profile.mbti, icon: <Info className="w-4 h-4" /> },
            ]
        },
        {
            title: "Current Focus",
            icon: <Target className="w-5 h-5 text-blue-500" />,
            items: [
                { label: "Currently Obsessed With", value: profile.currently_obsessed_with, icon: <Heart className="w-4 h-4" /> },
                { label: "Random Skill", value: profile.random_skill, icon: <Sparkles className="w-4 h-4" /> },
            ]
        },
        {
            title: "Lifestyle",
            icon: <Users className="w-5 h-5 text-emerald-500" />,
            items: [
                { label: "Relationship", value: profile.relationship_status, icon: <Heart className="w-4 h-4" /> },
                { label: "Zodiac Sign", value: profile.zodiac_sign, icon: <Zap className="w-4 h-4" /> },
            ]
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Bio Card (if not already shown elsewhere prominently) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Bookmark className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-bold text-white">About Me</h3>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {profile.bio || "No bio added yet."}
                </p>
                {profile.favorite_quote && (
                    <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-xl italic text-slate-400 relative">
                        <MessageCircle className="absolute -top-3 -left-3 w-6 h-6 text-blue-500/20" />
                        "{profile.favorite_quote}"
                    </div>
                )}
            </motion.div>

            {/* Interests Tags */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-bold text-white">Interests & Hobbies</h3>
                </div>
                {profile.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, idx) => (
                            <span 
                                key={idx}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 italic">No interests selected yet.</p>
                )}
            </motion.div>

            {/* Vibe Tags */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Coffee className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-bold text-white">Vibe & Identity</h3>
                </div>
                {profile.vibe_tags && profile.vibe_tags.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {profile.vibe_tags.map((tag, idx) => (
                            <span 
                                key={idx}
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-slate-200 border border-slate-700/50 rounded-xl text-sm font-semibold shadow-inner"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 italic">No vibe tags added.</p>
                )}
            </motion.div>

            {/* Looking For */}
            {profile.looking_for && profile.looking_for.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-bold text-white">Looking For</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.looking_for.map((item, idx) => (
                            <span 
                                key={idx}
                                className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Taste & Fun Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Bucket List */}
                {profile.bucket_list && profile.bucket_list.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="w-5 h-5 text-orange-500" />
                            <h3 className="text-lg font-bold text-white">Bucket List</h3>
                        </div>
                        <ul className="space-y-3">
                            {profile.bucket_list.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-300">
                                    <span className="text-orange-500/50 font-bold">{idx + 1}.</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Pet Peeves */}
                {profile.pet_peeves && profile.pet_peeves.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-5 h-5 text-red-500" />
                            <h3 className="text-lg font-bold text-white">Pet Peeves</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.pet_peeves.map((item, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-red-500/5 text-red-400/80 border border-red-500/10 rounded-lg text-xs italic">
                                    #{item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {sections.map((section, sidx) => (
                    <motion.div 
                        key={sidx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + sidx * 0.1 }}
                        className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            {section.icon}
                            <h3 className="text-lg font-bold text-white">{section.title}</h3>
                        </div>
                        <div className="space-y-4">
                            {section.items.map((item, iidx) => (
                                <div key={iidx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        {item.icon}
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        {renderValue(item.value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
