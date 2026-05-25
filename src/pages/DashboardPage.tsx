import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { 
  Plus, Trash2, GripVertical, ExternalLink, Settings, 
  LogOut, User as UserIcon, Eye, Save 
} from "lucide-react";
import { 
  DragDropContext, Droppable, Draggable 
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  doc, setDoc, getDoc 
} from "firebase/firestore";

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

const DashboardPage = ({ user }: { user: User }) => {
  const [profile, setProfile] = useState<UserProfile>({
    username: user.email?.split("@")[0] || "user",
    displayName: user.displayName || "익명",
    bio: "내 소셜 링크들을 모아보세요.",
    photoURL: user.photoURL || "",
    links: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  // Firestore에서 프로필 로드
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // 초기 생성
          await setDoc(docRef, profile);
        }
      } catch (err) {
        console.error("DB Load Error:", err);
      }
    };
    fetchProfile();
  }, [user]);

  const saveProfile = async (updatedProfile: UserProfile) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), updatedProfile);
      // 공개 페이지를 위한 별도 색인 정보 업데이트 (예: username 기반 조회용)
      await setDoc(doc(db, "usernames", updatedProfile.username), { uid: user.uid });
    } catch (err) {
      console.error("Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: "새 링크",
      url: "https://",
      enabled: true,
    };
    const updated = { ...profile, links: [...profile.links, newLink] };
    setProfile(updated);
    saveProfile(updated);
  };

  const removeLink = (id: string) => {
    const updated = { ...profile, links: profile.links.filter(l => l.id !== id) };
    setProfile(updated);
    saveProfile(updated);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    const updated = {
      ...profile,
      links: profile.links.map(l => (l.id === id ? { ...l, ...updates } : l)),
    };
    setProfile(updated);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(profile.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updated = { ...profile, links: items };
    setProfile(updated);
    saveProfile(updated);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col items-center py-4 md:py-8 gap-6 px-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold text-xl">M</div>
        <div className="hidden md:flex flex-col gap-8 flex-1 justify-center">
            <button className="p-3 bg-white/10 rounded-xl text-white"><Settings size={22} /></button>
            <button className="p-3 text-muted-foreground hover:text-white transition-colors"><UserIcon size={22} /></button>
        </div>
        <button onClick={() => signOut(auth)} className="p-3 text-muted-foreground hover:text-destructive transition-colors ml-auto md:ml-0">
          <LogOut size={22} />
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-2xl space-y-12">
          
          {/* Profile Editor */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">프로필 편집</h2>
              <div className="flex items-center gap-4">
                <a 
                  href={`/my-link/@${profile.username}`} 
                  target="_blank" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <Eye size={16} /> 내 페이지 보기
                </a>
                <button 
                  onClick={() => saveProfile(profile)}
                  className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${isSaving ? 'bg-white/10 text-white/50' : 'bg-white text-black font-bold'}`}
                  disabled={isSaving}
                >
                  <Save size={16} /> {isSaving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                   <img src={profile.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-white/20" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Plus size={20} className="text-white" />
                   </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Nickname</label>
                    <input 
                      type="text" 
                      value={profile.displayName} 
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Username (@)</label>
                      <input 
                        type="text" 
                        value={profile.username} 
                        onChange={(e) => setProfile({ ...profile, username: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "") })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase">Bio</label>
                <textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </section>

          {/* Links Editor */}
          <section className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">링크 관리</h2>
              <button 
                onClick={addLink}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-full transition-colors"
              >
                <Plus size={18} /> 링크 추가
              </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    <AnimatePresence>
                      {profile.links.map((link, index) => (
                        <Draggable key={link.id} draggableId={link.id} index={index}>
                          {(provided) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="glass border border-white/10 p-4 rounded-2xl flex items-center gap-4 group"
                            >
                              <div {...provided.dragHandleProps} className="text-muted-foreground hover:text-white cursor-grab">
                                <GripVertical size={20} />
                              </div>
                              <div className="flex-1 space-y-2">
                                <input 
                                  type="text" 
                                  value={link.title} 
                                  placeholder="제목"
                                  onChange={(e) => updateLink(link.id, { title: e.target.value })}
                                  onBlur={() => saveProfile(profile)}
                                  className="w-full bg-transparent font-bold text-lg focus:outline-none"
                                />
                                <div className="flex items-center gap-2">
                                  <ExternalLink size={14} className="text-muted-foreground" />
                                  <input 
                                    type="text" 
                                    value={link.url} 
                                    placeholder="URL"
                                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                    onBlur={() => saveProfile(profile)}
                                    className="w-full bg-transparent text-sm text-muted-foreground focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => {
                                    const next = !link.enabled;
                                    updateLink(link.id, { enabled: next });
                                    const updated = { ...profile, links: profile.links.map(l => l.id === link.id ? {...l, enabled: next} : l) };
                                    saveProfile(updated);
                                  }}
                                  className={`w-12 h-6 rounded-full p-1 transition-colors ${link.enabled ? 'bg-green-500' : 'bg-white/10'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${link.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                                <button 
                                  onClick={() => removeLink(link.id)}
                                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-2"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                    {profile.links.length === 0 && (
                      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-muted-foreground">
                        아직 추가된 링크가 없습니다.
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>
        </div>
      </main>

      {/* Mobile Preview Overlay (Optional) */}
      <aside className="hidden lg:flex w-[450px] border-l border-white/10 bg-black/20 items-center justify-center p-10">
          <div className="w-full h-full max-h-[800px] border-[8px] border-zinc-800 rounded-[3rem] overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 w-full h-6 bg-zinc-800 flex justify-center items-end pb-1">
                  <div className="w-20 h-4 bg-black rounded-b-xl" />
              </div>
              <iframe 
                src={`/my-link/@${profile.username}?preview=true`} 
                className="w-full h-full bg-[#09090b]"
                title="Preview"
              />
          </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); }
      `}} />
    </div>
  );
};

export default DashboardPage;
