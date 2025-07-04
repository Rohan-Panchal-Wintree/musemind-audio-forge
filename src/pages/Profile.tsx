
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { toast } from "sonner";
import { Heart, Play, Trash2, Grid, List, User, Calendar } from "lucide-react";

const Profile = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/api/placeholder/128/128",
    joinDate: "March 2024",
    totalTracks: 28
  };

  // Mock saved tracks
  const savedTracks = [
    {
      id: "1",
      title: "Chill lo-fi with piano and rain sounds",
      duration: 180,
      url: "/api/placeholder-audio",
      createdAt: "2024-01-15",
      liked: true
    },
    {
      id: "2", 
      title: "Upbeat electronic dance with synth waves",
      duration: 240,
      url: "/api/placeholder-audio",
      createdAt: "2024-01-14",
      liked: true
    },
    {
      id: "3",
      title: "Acoustic guitar with soft vocals",
      duration: 210,
      url: "/api/placeholder-audio", 
      createdAt: "2024-01-13",
      liked: true
    },
    {
      id: "4",
      title: "Ambient space sounds with dreamy pads",
      duration: 300,
      url: "/api/placeholder-audio",
      createdAt: "2024-01-12",
      liked: true
    }
  ];

  const handleRemoveTrack = (trackId: string) => {
    toast.success("Track removed from your saved list");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-gray-400 mb-4">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {user.joinDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    {user.totalTracks} Tracks Liked
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  Edit Profile
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Tracks Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Your Saved Tracks</h2>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tracks Display */}
            {savedTracks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-white mb-2">No saved tracks yet</h3>
                <p className="text-gray-400 mb-6">Start generating music and save your favorites!</p>
                <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                  Create Your First Track
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2" : "space-y-6"}>
                {savedTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`bg-slate-700/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-colors ${
                      viewMode === "list" ? "flex items-center gap-6" : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <div className="space-y-4">
                        {/* Track Info */}
                        <div>
                          <h3 className="text-white font-semibold mb-2 line-clamp-2">{track.title}</h3>
                          <p className="text-gray-400 text-sm">Created {formatDate(track.createdAt)}</p>
                        </div>

                        {/* Mini Player */}
                        <AudioPlayer track={track} />

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                          >
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            Liked
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTrack(track.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* List View Content */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{track.title}</h3>
                          <p className="text-gray-400 text-sm">Created {formatDate(track.createdAt)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTrack(track.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
