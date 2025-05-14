import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  Timer,
} from '@mui/icons-material';
import BackgroundMusic from './BackgroundMusic';

const ActivityContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const BreathingCircle = styled('div')<{ $phase: string }>(({ theme, $phase }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%',
  border: '2px solid',
  borderColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  animation: $phase === 'inhale' 
    ? 'inhale 4s ease-in-out infinite'
    : $phase === 'exhale'
    ? 'exhale 4s ease-in-out infinite'
    : 'none',
  '@keyframes inhale': {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.5)' }
  },
  '@keyframes exhale': {
    from: { transform: 'scale(1.5)' },
    to: { transform: 'scale(1)' }
  }
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

interface BreathingExercise {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
}

const breathingExercises: BreathingExercise[] = [
  {
    name: "4-7-8 Breathing",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Helps reduce anxiety and promote sleep."
  },
  {
    name: "Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: "Equal duration for inhale, hold, and exhale. Creates mental clarity and calmness."
  },
  {
    name: "Deep Belly Breathing",
    inhale: 5,
    hold: 2,
    exhale: 5,
    description: "Focus on breathing deep into your belly. Reduces stress and improves focus."
  }
];

const GuidedActivities: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [meditationTime, setMeditationTime] = useState(5);
  const [isMeditating, setIsMeditating] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startBreathing = () => {
    if (!selectedExercise) return;
    setIsBreathing(true);
    setBreathingPhase('inhale');

    const cycle = () => {
      setBreathingPhase(current => {
        if (current === 'inhale') return 'hold';
        if (current === 'hold') return 'exhale';
        return 'inhale';
      });
    };

    timerRef.current = setInterval(() => {
      cycle();
    }, selectedExercise.inhale * 1000);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingPhase('inhale');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startMeditation = () => {
    setIsMeditating(true);
    setRemainingTime(meditationTime * 60);

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          stopMeditation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ActivityContainer>
      <Typography variant="h5" gutterBottom align="center">
        Guided Wellness Activities
      </Typography>

      <BackgroundMusic />
      
      <Divider sx={{ my: 4 }} />

      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          Breathing Exercises
        </Typography>
        <Grid container spacing={3}>
          {breathingExercises.map((exercise, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ActivityCard
                onClick={() => setSelectedExercise(exercise)}
                sx={{
                  border: selectedExercise?.name === exercise.name ? 2 : 0,
                  borderColor: 'primary.main',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {exercise.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {exercise.description}
                  </Typography>
                  <Typography variant="body2" mt={2}>
                    Inhale: {exercise.inhale}s
                    {exercise.hold > 0 && ` | Hold: ${exercise.hold}s`}
                    | Exhale: {exercise.exhale}s
                  </Typography>
                </CardContent>
              </ActivityCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedExercise && (
        <Box my={4} textAlign="center">
          <BreathingCircle $phase={isBreathing ? breathingPhase : 'none'}>
            <Typography variant="h6">
              {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)}
            </Typography>
          </BreathingCircle>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={isBreathing ? stopBreathing : startBreathing}
              startIcon={isBreathing ? <Stop /> : <PlayArrow />}
            >
              {isBreathing ? 'Stop' : 'Start'} {selectedExercise.name}
            </Button>
          </Box>
        </Box>
      )}

      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          Meditation Timer
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Duration</InputLabel>
            <Select
              value={meditationTime}
              onChange={(e) => setMeditationTime(Number(e.target.value))}
              disabled={isMeditating}
            >
              <MenuItem value={5}>5 minutes</MenuItem>
              <MenuItem value={10}>10 minutes</MenuItem>
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={20}>20 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={isMeditating ? stopMeditation : startMeditation}
            startIcon={isMeditating ? <Stop /> : <PlayArrow />}
          >
            {isMeditating ? 'Stop' : 'Start'} Meditation
          </Button>
        </Box>
        {isMeditating && (
          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <CircularProgress
              variant="determinate"
              value={(remainingTime / (meditationTime * 60)) * 100}
            />
            <Typography variant="h6">
              {formatTime(remainingTime)}
            </Typography>
          </Box>
        )}
      </Box>
    </ActivityContainer>
  );
};

export default GuidedActivities; 