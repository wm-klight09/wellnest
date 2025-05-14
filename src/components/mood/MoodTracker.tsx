import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Grid,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material';

const MoodContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const MoodIcon = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(2),
  '&.selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const FactorCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
}));

interface MoodEntry {
  date: string;
  mood: number;
  factors: {
    sleep: number;
    exercise: number;
    social: number;
  };
  notes: string;
}

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [factors, setFactors] = useState({
    sleep: 50,
    exercise: 50,
    social: 50,
  });

  useEffect(() => {
    // Load mood history from localStorage
    const savedHistory = localStorage.getItem('wellnest_mood_history');
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
  };

  const handleFactorChange = (factor: keyof typeof factors, value: number) => {
    setFactors(prev => ({
      ...prev,
      [factor]: value,
    }));
  };

  const handleSaveMood = () => {
    if (selectedMood !== null) {
      const newEntry: MoodEntry = {
        date: new Date().toISOString(),
        mood: selectedMood,
        factors: { ...factors },
        notes: '',
      };

      const updatedHistory = [...moodHistory, newEntry];
      setMoodHistory(updatedHistory);
      localStorage.setItem('wellnest_mood_history', JSON.stringify(updatedHistory));

      // Reset form
      setSelectedMood(null);
      setFactors({ sleep: 50, exercise: 50, social: 50 });
    }
  };

  const getMoodIcon = (mood: number, isSelected: boolean = false) => {
    const props = {
      fontSize: 'large',
      className: isSelected ? 'selected' : '',
      onClick: () => handleMoodSelect(mood),
    };

    switch (mood) {
      case 0: return <MoodIcon {...props}><SentimentVeryDissatisfied /></MoodIcon>;
      case 1: return <MoodIcon {...props}><SentimentDissatisfied /></MoodIcon>;
      case 2: return <MoodIcon {...props}><SentimentNeutral /></MoodIcon>;
      case 3: return <MoodIcon {...props}><SentimentSatisfied /></MoodIcon>;
      case 4: return <MoodIcon {...props}><SentimentVerySatisfied /></MoodIcon>;
      default: return null;
    }
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return sum / moodHistory.length;
  };

  return (
    <MoodContainer>
      <Typography variant="h5" gutterBottom align="center">
        Mood Tracker
      </Typography>

      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          How are you feeling today?
        </Typography>
        <Box display="flex" justifyContent="space-around" mb={3}>
          {[0, 1, 2, 3, 4].map(mood => getMoodIcon(mood, mood === selectedMood))}
        </Box>
      </Box>

      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          Contributing Factors
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FactorCard>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Sleep Quality
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={factors.sleep}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Button
                    size="small"
                    onClick={() => handleFactorChange('sleep', Math.max(0, factors.sleep - 10))}
                  >
                    -
                  </Button>
                  <Typography>{factors.sleep}%</Typography>
                  <Button
                    size="small"
                    onClick={() => handleFactorChange('sleep', Math.min(100, factors.sleep + 10))}
                  >
                    +
                  </Button>
                </Box>
              </CardContent>
            </FactorCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <FactorCard>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Exercise Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={factors.exercise}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Button
                    size="small"
                    onClick={() => handleFactorChange('exercise', Math.max(0, factors.exercise - 10))}
                  >
                    -
                  </Button>
                  <Typography>{factors.exercise}%</Typography>
                  <Button
                    size="small"
                    onClick={() => handleFactorChange('exercise', Math.min(100, factors.exercise + 10))}
                  >
                    +
                  </Button>
                </Box>
              </CardContent>
            </FactorCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <FactorCard>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Social Interaction
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={factors.social}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Button
                    size="small"
                    onClick={() => handleFactorChange('social', Math.max(0, factors.social - 10))}
                  >
                    -
                  </Button>
                  <Typography>{factors.social}%</Typography>
                  <Button
                    size="small"
                    onClick={() => handleFactorChange('social', Math.min(100, factors.social + 10))}
                  >
                    +
                  </Button>
                </Box>
              </CardContent>
            </FactorCard>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSaveMood}
          disabled={selectedMood === null}
        >
          Save Today's Mood
        </Button>
      </Box>

      {moodHistory.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Your Mood History
          </Typography>
          <Typography variant="body1">
            Average Mood: {getAverageMood().toFixed(1)} / 4
          </Typography>
          <Box display="flex" mt={2}>
            {moodHistory.slice(-7).map((entry, index) => (
              <Box key={index} mx={1}>
                {getMoodIcon(entry.mood)}
                <Typography variant="caption" display="block" textAlign="center">
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </MoodContainer>
  );
};

export default MoodTracker; 