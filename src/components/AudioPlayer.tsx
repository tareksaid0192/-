import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, Radio } from 'lucide-react';

interface AudioPlayerProps {
  duration: string;
  script: string;
  audioUrl?: string;
}

function parseSeconds(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length < 2) return 60;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ duration, script, audioUrl }: AudioPlayerProps) {
  const totalSeconds = parseSeconds(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Stop when unmounting
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (audioUrl && audioRef.current) {
        audioRef.current.pause();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else {
      // Play
      setIsPlaying(true);

      if (audioUrl && audioRef.current) {
        audioRef.current.play();
      } else if ('speechSynthesis' in window) {
        // If speaking already paused, resume
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(script);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.95;
          utterance.onend = () => {
            setIsPlaying(false);
            setCurrentSeconds(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
          };
          window.speechSynthesis.speak(utterance);
        }
      }

      // Progress counter
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleRewind = () => {
    setCurrentSeconds((prev) => Math.max(0, prev - 10));
    if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleForward = () => {
    setCurrentSeconds((prev) => Math.min(totalSeconds, prev + 10));
    if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = Math.min(totalSeconds, audioRef.current.currentTime + 10);
    }
  };

  const progressPercent = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EAE4F2] mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#5B3D91]" />
          <h3 className="font-bold text-base text-[#5B3D91]">استمعي للتعليمات الصوتية</h3>
        </div>
        {audioUrl ? (
          <span className="flex items-center gap-1 bg-[#4DB6AC]/15 text-[#4DB6AC] text-xs font-semibold px-2.5 py-1 rounded-full">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            صوت مسجل
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-[#5B3D91]/10 text-[#5B3D91] text-xs font-semibold px-2.5 py-1 rounded-full">
            قارئ صوتي ذكي
          </span>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentSeconds(0);
          }}
        />
      )}

      {/* Script Box */}
      <div className="bg-[#F8F6FA] rounded-xl p-4 mb-4 border-r-4 border-[#5B3D91]">
        <p className="text-[#2D253D] text-sm leading-relaxed text-right font-medium">
          {script}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 my-3">
        <button
          onClick={handleRewind}
          className="p-2 text-[#7A708A] hover:text-[#5B3D91] hover:bg-[#F8F6FA] rounded-full transition-colors cursor-pointer"
          title="رجوع 10 ثوانٍ"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <div className="relative">
          {isPlaying && (
            <span className="absolute -inset-2 rounded-full bg-[#5B3D91]/25 animate-ping" />
          )}
          <button
            onClick={handlePlayPause}
            className="relative w-14 h-14 rounded-full bg-[#5B3D91] hover:bg-[#4a2e7c] text-white flex items-center justify-center shadow-md shadow-[#5B3D91]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>
        </div>

        <button
          onClick={handleForward}
          className="p-2 text-[#7A708A] hover:text-[#5B3D91] hover:bg-[#F8F6FA] rounded-full transition-colors cursor-pointer"
          title="تقديم 10 ثوانٍ"
        >
          <RotateCw className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar & Time */}
      <div className="space-y-1.5 mt-2">
        <div className="h-2 w-full bg-[#EAE4F2] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-[#5B3D91] to-[#7B5BAF] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#7A708A] font-poppins font-medium">
          <span>{formatTime(currentSeconds)}</span>
          <span>{formatTime(totalSeconds)}</span>
        </div>
      </div>
    </div>
  );
}
