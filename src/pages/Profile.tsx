
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { toast } from "sonner";
import { Heart, Trash2, User, Calendar, Edit3, Save, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Profile = () => {
  const { user, savedTracks, removeTrack, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Name and email cannot be empty");
      return;
    }

    updateProfile({
      name: editName.trim(),
      email: editEmail.trim()
    });
    
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setIsEditing(false);
  };

  const handleRemoveTrack = (trackId: string) => {
    removeTrack(trackId);
    toast.success("Track removed from your saved list");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 pb-16">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-700/50 border-purple-500/30 text-white"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="bg-slate-700/50 border-purple-500/30 text-white"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                    <p className="text-gray-400 mb-4">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Member since March 2024
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        ❤️ Liked Tracks: {savedTracks.length}
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      ✏️ Edit Profile
                    </Button>
                  </div>
                )}
              </div>

              {/* Credits & Actions */}
              <div className="flex flex-col gap-3">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">🎵</div>
                  <div className="text-2xl font-bold text-white">{user.credits}</div>
                  <div className="text-sm text-gray-400">Credits Remaining</div>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                  💳 Buy More Credits
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Tracks Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-8">💾 Your Saved Tracks</h2>

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
              <div className="space-y-6">
                {savedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-slate-700/50 rounded-xl p-6 border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{track.title}</h3>
                        <p className="text-gray-400 text-sm">Created {formatDate(track.dateCreated)}</p>
                      </div>
                      <div className="flex gap-2">
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
                    </div>
                    <AudioPlayer track={track} />
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
