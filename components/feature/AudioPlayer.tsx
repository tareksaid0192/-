import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';

interface AudioPlayerProps {
  duration: string;
  script: string;
  audioUrl?: string;
}

function parseSeconds(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
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
  const [realDuration, setRealDuration] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load real audio when URL is provided
  useEffect(() => {
    let mounted = true;
    const loadSound = async () => {
      if (!audioUrl) return;
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          (status) => {
            if (!mounted) return;
            if (status.isLoaded) {
              if (status.durationMillis) {
                setRealDuration(Math.floor(status.durationMillis / 1000));
              }
              setCurrentSeconds(Math.floor((status.positionMillis ?? 0) / 1000));
              if (status.didJustFinish) {
                setIsPlaying(false);
                setCurrentSeconds(0);
              }
            }
          }
        );
        soundRef.current = sound;
      } catch {
        // silently fallback to simulated player
      }
    };
    loadSound();
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
    };
  }, [audioUrl]);

  // Simulated playback (when no real audio)
  useEffect(() => {
    if (audioUrl) return; // handled by real audio
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= realDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, audioUrl, realDuration]);

  // Pulse animation
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (soundRef.current && audioUrl) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = async () => {
    if (soundRef.current && audioUrl) {
      const pos = Math.max(0, currentSeconds - 10) * 1000;
      await soundRef.current.setPositionAsync(pos);
    }
    setCurrentSeconds((prev) => Math.max(0, prev - 10));
  };

  const handleForward = async () => {
    if (soundRef.current && audioUrl) {
      const pos = Math.min(realDuration, currentSeconds + 10) * 1000;
      await soundRef.current.setPositionAsync(pos);
    }
    setCurrentSeconds((prev) => Math.min(realDuration, prev + 10));
  };

  const displayTotal = audioUrl ? realDuration : totalSeconds;
  const progress = displayTotal > 0 ? currentSeconds / displayTotal : 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>🎧 استمعي للتعليمات</Text>
        {audioUrl ? (
          <View style={styles.realAudioBadge}>
            <MaterialIcons name="wifi-tethering" size={13} color={Colors.teal} />
            <Text style={styles.realAudioText}>صوت حقيقي</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.scriptBox}>
        <Text style={styles.scriptText}>{script}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleForward} activeOpacity={0.7} style={styles.controlBtn}>
          <MaterialIcons name="forward-10" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={38}
              color={Colors.white}
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={handleRewind} activeOpacity={0.7} style={styles.controlBtn}>
          <MaterialIcons name="replay-10" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(displayTotal - currentSeconds)}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.timeText}>{formatTime(currentSeconds)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 16,
    color: Colors.primary,
  },
  realAudioBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.teal + '20',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  realAudioText: {
    fontFamily: FontFamily.cairo,
    fontSize: 11,
    color: Colors.teal,
  },
  scriptBox: {
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRightWidth: 3,
    borderRightColor: Colors.primary,
  },
  scriptText: {
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'right',
    lineHeight: 24,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.lg,
  },
  controlBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  progressContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  timeText: {
    fontFamily: FontFamily.poppins,
    fontSize: 12,
    color: Colors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
  },
});
