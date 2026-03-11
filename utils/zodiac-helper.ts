export const ZODIAC_COMPATIBILITY: { [key: string]: string[] } = {
    Aries: ["Leo", "Sagittarius", "Gemini", "Libra", "Aquarius"],
    Taurus: ["Virgo", "Capricorn", "Cancer", "Scorpio", "Pisces"],
    Gemini: ["Libra", "Aquarius", "Aries", "Leo", "Sagittarius"],
    Cancer: ["Scorpio", "Pisces", "Taurus", "Virgo", "Capricorn"],
    Leo: ["Aries", "Sagittarius", "Gemini", "Libra", "Aquarius"],
    Virgo: ["Taurus", "Capricorn", "Cancer", "Scorpio", "Pisces"],
    Libra: ["Gemini", "Aquarius", "Aries", "Leo", "Sagittarius"],
    Scorpio: ["Cancer", "Pisces", "Taurus", "Virgo", "Capricorn"],
    Sagittarius: ["Aries", "Leo", "Gemini", "Libra", "Aquarius"],
    Capricorn: ["Taurus", "Virgo", "Cancer", "Scorpio", "Pisces"],
    Aquarius: ["Gemini", "Libra", "Aries", "Leo", "Sagittarius"],
    Pisces: ["Cancer", "Scorpio", "Taurus", "Virgo", "Capricorn"],
};

export const getZodiacCompatibility = (sign1: string, sign2: string): { 
    isCompatible: boolean; 
    message: string;
    level: "Perfect" | "Good" | "Mixed";
} => {
    if (!sign1 || !sign2) return { isCompatible: false, message: "", level: "Mixed" };
    
    const favorites = ZODIAC_COMPATIBILITY[sign1] || [];
    const isCompatible = favorites.includes(sign2);
    
    if (isCompatible) {
        if (favorites[0] === sign2 || favorites[1] === sign2) {
            return { isCompatible: true, message: "Perfect Match! 🔥", level: "Perfect" };
        }
        return { isCompatible: true, message: "Great Connection ✨", level: "Good" };
    }
    
    return { isCompatible: false, message: "Interesting Dyamic 🌀", level: "Mixed" };
};
