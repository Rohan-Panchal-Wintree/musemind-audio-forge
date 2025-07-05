
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react";

interface Track {
  id: string;
  title: string;
  url: string;
  duration: number;
}

interface AudioPlayerProps {
  track: Track;
}

export const AudioPlayer = ({ track }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [track.url]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Create a dummy audio source for demonstration since we don't have real audio files
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        setIsPlaying(true);
        
        // Simulate audio progress for demo
        const startTime = Date.now();
        const simulateProgress = () => {
          if (!isPlaying) return;
          const elapsed = (Date.now() - startTime) / 1000;
          setCurrentTime(elapsed);
          if (elapsed < (duration || track.duration)) {
            requestAnimationFrame(simulateProgress);
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
            oscillator.stop();
          }
        };
        simulateProgress();
        
        // Stop after duration
        setTimeout(() => {
          oscillator.stop();
          setIsPlaying(false);
          setCurrentTime(0);
        }, (duration || track.duration) * 1000);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-slate-700/50 rounded-xl p-6 border border-purple-500/20">
      <audio 
        ref={audioRef} 
        src={track.url}
        preload="metadata"
      />
      
      <div className="flex flex-col space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <h4 className="text-white font-medium text-lg">{track.title}</h4>
        </div>

        {/* Waveform Visualization */}
        <div className="h-16 bg-slate-800/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="flex items-end gap-1 h-8">
            {Array.from({ length: 50 }).map((_, i) => {
              const isActive = i < (progress / 100) * 50;
              const height = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
              return (
                <div
                  key={i}
                  className={`w-1 transition-all duration-150 ${
                    isActive 
                      ? 'bg-gradient-to-t from-green-500 to-purple-500' 
                      : 'bg-gradient-to-t from-purple-500/30 to-green-500/30'
                  } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
                  style={{
                    height: `${Math.max(10, Math.min(100, height))}%`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: '1s'
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || track.duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #22c55e ${progress}%, #475569 ${progress}%, #475569 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <Button
            onClick={togglePlay}
            className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 p-3 rounded-full"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a855f7, #22c55e);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a855f7, #22c55e);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `
      }} />
    </div>
  );
};
