
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CreditsModal } from "@/components/CreditsModal";
import { toast } from "sonner";
import { Volume2, Upload, Heart, Save } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<{
    id: string;
    title: string;
    url: string;
    duration: number;
  } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  
  const { user, isLoggedIn, deductCredits, saveTrack } = useUser();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a music prompt");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please log in to generate music");
      navigate("/login");
      return;
    }

    if (!user || user.credits < 1) {
      setShowCreditsModal(true);
      return;
    }

    setIsGenerating(true);
    
    // Deduct credit first
    deductCredits(1);
    toast.success("1 credit deducted");
    
    // Simulate music generation
    setTimeout(() => {
      const newTrack = {
        id: "track_" + Date.now(),
        title: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
        url: "/api/placeholder-audio",
        duration: 180
      };
      setGeneratedTrack(newTrack);
      setIsGenerating(false);
      toast.success("Music generated successfully!");
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
      if (validTypes.includes(file.type)) {
        setUploadedFile(file);
        toast.success(`Uploaded: ${file.name}`);
      } else {
        toast.error("Please upload a valid audio file (.mp3, .wav, .m4a)");
      }
    }
  };

  const handleLike = () => {
    if (!generatedTrack) return;
    
    const trackToSave = {
      ...generatedTrack,
      dateCreated: new Date().toISOString()
    };
    
    saveTrack(trackToSave);
    toast.success("Track saved to your profile! ❤️");
  };

  const handleSave = () => {
    handleLike(); // Same functionality for now
  };

  const handleRegenerate = () => {
    if (!user || user.credits < 1) {
      setShowCreditsModal(true);
      return;
    }
    
    setGeneratedTrack(null);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Generate AI-Powered Music from Your Imagination
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Enter a prompt. Upload a vibe. Create audio.
            </p>
          </div>

          {/* Generation Interface */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Chill lo-fi with piano and rain sounds"
                  className="w-full h-14 text-lg bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
                />
              </div>

              {/* File Upload */}
              <div className="flex items-center justify-center">
                <label className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 text-gray-300 rounded-lg border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  {uploadedFile ? uploadedFile.name : "Upload Sample (optional)"}
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Credit Info */}
              {isLoggedIn && (
                <div className="text-sm text-gray-400">
                  Cost: 1 credit per generation • You have {user?.credits || 0} credits
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 border-0"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Music...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    🔊 Generate Music
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Track */}
          {generatedTrack && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Your Generated Track</h3>
              <AudioPlayer track={generatedTrack} />
              <div className="flex gap-4 justify-center mt-6">
                <Button
                  onClick={handleLike}
                  variant="outline"
                  className="flex items-center gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <Heart className="w-4 h-4" />
                  Like & Save
                </Button>
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex items-center gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <Volume2 className="w-4 h-4" />
                  🔁 Regenerate (1 credit)
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <CreditsModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </div>
  );
};

export default Index;
