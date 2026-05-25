import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ExternalLink, Share2, AlertCircle } from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
}

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
  links: LinkItem[];
}

const ProfilePage = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileByUsername = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        // 1. Username으로 UID 찾기
        const nameRef = doc(db, "usernames", username);
        const nameSnap = await getDoc(nameRef);
        
        if (!nameSnap.exists()) {
          setError("사용자를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const uid = nameSnap.data().uid;
        
        // 2. UID로 프로필 데이터 가져오기
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else {
          setError("프로필 정보가 존재하지 않습니다.");
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileByUsername();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">{error || "404 Not Found"}</h1>
        <p className="text-muted-foreground mb-8">요청하신 페이지를 찾을 수 없거나 일시적인 오류입니다.</p>
        <a href="/my-link" className="bg-white text-black font-bold px-6 py-2 rounded-full">홈으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#09090b] text-foreground flex flex-col items-center p-6 md:p-12 pb-24 ${isPreview ? 'p-4' : ''}`}>
      <div className="w-full max-w-xl flex flex-col items-center mt-8">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <img 
            src={profile.photoURL || "https://via.placeholder.com/150"} 
            alt={profile.displayName} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/5 mb-6 mx-auto shadow-2xl" 
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">@{profile.username}</h1>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
        </motion.div>

        {/* Links List */}
        <div className="w-full space-y-4">
          {profile.links.filter(l => l.enabled).map((link, index) => (
            <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all group"
            >
                <div className="w-10 h-10 flex-shrink-0" /> {/* Spacer for centering */}
                <span className="font-bold text-center text-lg">{link.title}</span>
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full text-white/50 group-hover:text-white transition-colors">
                    <ExternalLink size={18} />
                </div>
            </motion.a>
          ))}
          {profile.links.filter(l => l.enabled).length === 0 && (
              <p className="text-center text-muted-foreground py-20">아직 공개된 링크가 없습니다.</p>
          )}
        </div>

        {/* Branding */}
        {!isPreview && (
          <div className="fixed bottom-8">
             <a href="/my-link" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium transition-all">
                <Share2 size={14} /> MyLink 직접 만들기
             </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
