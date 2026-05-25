import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { Link2, ChevronRight, Zap, Share2, MousePointer2, ExternalLink } from "lucide-react";

const LandingPage = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
      alert("로그인 중 오류가 발생했습니다. (Firebase 설정이 필요할 수 있습니다.)");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 text-sm text-muted-foreground glass">
          <Zap size={14} className="text-yellow-400" />
          <span className="font-medium">1분 만에 완성하는 나만의 링크 페이지</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Everything you are. <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            In one simple link.
          </span>
        </h1>

        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          다양한 소셜 채널, 포트폴리오, 프로젝트를 <br className="hidden md:block" />
          하나의 아름다운 프로필 페이지로 모으고 공유하세요.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleLogin}
            className="group relative flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            Google로 시작하기
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a 
            href="https://github.com/kimna428/my-link"
            target="_blank"
            className="flex items-center gap-2 text-white/70 hover:text-white px-8 py-4 font-medium transition-colors"
          >
            <ExternalLink size={20} />
            View Source
          </a>
        </div>
      </motion.div>

      {/* Feature Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl"
      >
        <div className="glass p-6 rounded-2xl flex flex-col gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
            <Link2 size={24} />
          </div>
          <h3 className="font-bold text-lg">링크 통합</h3>
          <p className="text-sm text-muted-foreground">여러 개의 링크를 하나로 묶어 효율적으로 공유하세요.</p>
        </div>
        
        <div className="glass p-6 rounded-2xl flex flex-col gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
            <Share2 size={24} />
          </div>
          <h3 className="font-bold text-lg">간편한 공유</h3>
          <p className="text-sm text-muted-foreground">나만의 고유 URL을 생성하고 어디든 배포하세요.</p>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col gap-3">
          <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-400">
            <MousePointer2 size={24} />
          </div>
          <h3 className="font-bold text-lg">실시간 수정</h3>
          <p className="text-sm text-muted-foreground">언제 어디서나 링크의 순서와 내용을 관리하세요.</p>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-bg { background: radial-gradient(circle at top center, #111111 0%, #000000 100%); }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); }
      `}} />
    </div>
  );
};

export default LandingPage;
