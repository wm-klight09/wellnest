import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  styled,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  RestartAlt,
  Add,
  Remove,
} from '@mui/icons-material';
import { ActivityTracker } from '../components/activities/ActivityTracker';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(8), // Space for bottom navigation
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const ContentCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const BreathingCircle = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%',
  border: '2px solid',
  borderColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '20px auto',
  position: 'relative',
  animation: 'none',
  '&.breathing': {
    animation: 'breathe 8s infinite ease-in-out',
  },
  '@keyframes breathe': {
    '0%, 100%': {
      transform: 'scale(1)',
      borderColor: theme.palette.primary.light,
    },
    '50%': {
      transform: 'scale(1.2)',
      borderColor: theme.palette.primary.main,
    },
  },
}));

const TimerDisplay = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 200,
  height: 200,
  margin: '20px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface BreathingPattern {
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  description: string;
}

const breathingPatterns: Record<string, BreathingPattern> = {
  '4-7-8': {
    inhale: 4,
    hold1: 7,
    exhale: 8,
    description: 'Inhale for 4, hold for 7, exhale for 8 seconds',
  },
  'box': {
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: 'Inhale, hold, exhale, and hold again for 4 seconds each',
  },
  'deep': {
    inhale: 5,
    exhale: 5,
    description: 'Deep belly breathing: inhale and exhale for 5 seconds each',
  },
};

const Wellness: React.FC = () => {
  // Meditation Timer States
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Enhanced breathing states
  const [breathingPattern, setBreathingPattern] = useState('4-7-8');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const runBreathingCycle = useCallback(async () => {
    const pattern = breathingPatterns[breathingPattern];
    
    const wait = (seconds: number) => new Promise(resolve => 
      setTimeout(resolve, seconds * 1000)
    );

    while (isBreathing) {
      // Inhale
      setBreathingPhase('Inhale');
      setSecondsLeft(pattern.inhale);
      for (let i = pattern.inhale; i > 0; i--) {
        if (!isBreathing) return;
        setSecondsLeft(i);
        await wait(1);
      }

      // First hold
      if (pattern.hold1) {
        setBreathingPhase('Hold');
        setSecondsLeft(pattern.hold1);
        for (let i = pattern.hold1; i > 0; i--) {
          if (!isBreathing) return;
          setSecondsLeft(i);
          await wait(1);
        }
      }

      // Exhale
      setBreathingPhase('Exhale');
      setSecondsLeft(pattern.exhale);
      for (let i = pattern.exhale; i > 0; i--) {
        if (!isBreathing) return;
        setSecondsLeft(i);
        await wait(1);
      }

      // Second hold (for box breathing)
      if (pattern.hold2) {
        setBreathingPhase('Hold');
        setSecondsLeft(pattern.hold2);
        for (let i = pattern.hold2; i > 0; i--) {
          if (!isBreathing) return;
          setSecondsLeft(i);
          await wait(1);
        }
      }
    }
  }, [breathingPattern, isBreathing]);

  useEffect(() => {
    if (isBreathing) {
      runBreathingCycle();
    } else {
      setBreathingPhase('');
      setSecondsLeft(0);
    }
  }, [isBreathing, runBreathingCycle]);

  const handleStartTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreathing = () => {
    setIsBreathing(true);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  return (
    <PageContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Wellness Practice
      </Typography>

      <ContentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Activity Tracking
          </Typography>
          <ActivityTracker />
        </CardContent>
      </ContentCard>

      <ContentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Meditation Timer
          </Typography>
          <TimerDisplay>
            <CircularProgress
              variant="determinate"
              value={(timeLeft / (duration * 60)) * 100}
              size={200}
              thickness={2}
              sx={{
                position: 'absolute',
                color: 'primary.light',
              }}
            />
            <Typography variant="h3" component="div" color="primary">
              {formatTime(timeLeft)}
            </Typography>
          </TimerDisplay>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => setDuration(Math.max(1, duration - 1))}>
              <Remove />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
              {duration}m
            </Typography>
            <IconButton onClick={() => setDuration(duration + 1)}>
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={isRunning ? <Pause /> : <PlayArrow />}
              onClick={handleStartTimer}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAlt />}
              onClick={handleResetTimer}
            >
              Reset
            </Button>
          </Box>
        </CardContent>
      </ContentCard>

      <ContentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Breathing Exercises
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Breathing Pattern</InputLabel>
            <Select
              value={breathingPattern}
              label="Breathing Pattern"
              onChange={(e) => setBreathingPattern(e.target.value)}
            >
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <MenuItem key={key} value={key}>
                  {pattern.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <BreathingCircle className={isBreathing ? 'breathing' : ''}>
            <Box sx={{ textAlign: 'center' }}>
              {breathingPhase && (
                <>
                  <Typography variant="h6" color="primary">
                    {breathingPhase}
                  </Typography>
                  <Typography variant="h4">{secondsLeft}</Typography>
                </>
              )}
            </Box>
          </BreathingCircle>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => (isBreathing ? stopBreathing() : startBreathing())}
            >
              {isBreathing ? 'Stop' : 'Start'} Breathing Exercise
            </Button>
          </Box>
        </CardContent>
      </ContentCard>
    </PageContainer>
  );
};

export default Wellness; 