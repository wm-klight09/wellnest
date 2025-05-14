import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const MusicCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  marginTop: theme.spacing(2),
}));

interface Track {
  name: string;
  url: string;
  artist: string;
}

// Using reliable direct MP3 URLs
const lofiTracks: Track[] = [
  {
    name: "Forest Meditation",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    artist: "SergeQuadrado"
  },
  {
    name: "Ocean Waves",
    url: "https://www.soundjay.com/nature/ocean-wave-1.mp3",
    artist: "Nature Sounds"
  },
  {
    name: "Gentle Stream",
    url: "https://www.soundjay.com/nature/river-1.mp3",
    artist: "Nature Serenity"
  },
  {
    name: "Peaceful Rain",
    url: "https://www.soundjay.com/nature/rain-01.mp3",
    artist: "Nature Sounds"
  }
];

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(lofiTracks[0].url);
    audioRef.current.volume = volume;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      handleTrackChange(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) {
        const playPromise = audioRef.current?.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.error('Playback failed:', error);
            setError('Playback failed. Please try again.');
            setIsPlaying(false);
          });
        }
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('canplay', handleCanPlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      setIsLoading(true);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsLoading(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = newValue as number;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    setIsMuted(!isMuted);
    audioRef.current.volume = isMuted ? volume : 0;
  };

  const handleTrackChange = (next: boolean = true) => {
    if (!audioRef.current) return;
    
    setError(null);
    setIsLoading(true);
    
    const newTrack = next
      ? (currentTrack + 1) % lofiTracks.length
      : (currentTrack - 1 + lofiTracks.length) % lofiTracks.length;
    
    setCurrentTrack(newTrack);
    audioRef.current.src = lofiTracks[newTrack].url;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Track change playback error:', error);
          setError('Failed to play the next track. Please try again.');
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <MusicCard>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Background Music
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton 
            onClick={() => handleTrackChange(false)} 
            size="small"
            disabled={isLoading}
          >
            <SkipPrevious />
          </IconButton>
          
          <IconButton 
            onClick={togglePlay} 
            size="small"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isPlaying ? (
              <Pause />
            ) : (
              <PlayArrow />
            )}
          </IconButton>
          
          <IconButton 
            onClick={() => handleTrackChange(true)} 
            size="small"
            disabled={isLoading}
          >
            <SkipNext />
          </IconButton>

          <Box sx={{ width: '100%', ml: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {lofiTracks[currentTrack].name} - {lofiTracks[currentTrack].artist}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <IconButton onClick={toggleMute} size="small" disabled={isLoading}>
            {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          
          <Slider
            size="small"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{ width: 100 }}
            disabled={isLoading}
          />
        </Box>
      </CardContent>
    </MusicCard>
  );
};

export default BackgroundMusic; 