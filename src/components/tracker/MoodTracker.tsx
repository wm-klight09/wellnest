import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  IconButton, 
  TextField,
  Button,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TrackerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)'
}));

const MoodButton = styled(IconButton)(({ theme }) => ({
  fontSize: '2rem',
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.2s'
  }
}));

const WeeklyProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: theme.spacing(1)
}));

interface DailyMood {
  date: string;
  mood: number;
  comment?: string;
}

interface WeeklyProgress {
  weekStarting: string;
  moods: DailyMood[];
  weeklyComment: string;
}

const moods = [
  { icon: SentimentVeryDissatisfiedIcon, label: 'Very Sad', value: 1 },
  { icon: SentimentDissatisfiedIcon, label: 'Sad', value: 2 },
  { icon: SentimentSatisfiedIcon, label: 'Okay', value: 3 },
  { icon: SentimentSatisfiedAltIcon, label: 'Happy', value: 4 },
  { icon: SentimentVerySatisfiedIcon, label: 'Very Happy', value: 5 }
];

export const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [dailyComment, setDailyComment] = useState('');
  const [weeklyComment, setWeeklyComment] = useState('');
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [currentWeek, setCurrentWeek] = useState<DailyMood[]>([]);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('weeklyProgress');
    if (savedProgress) {
      setWeeklyProgress(JSON.parse(savedProgress));
    }

    const savedCurrentWeek = localStorage.getItem('currentWeek');
    if (savedCurrentWeek) {
      setCurrentWeek(JSON.parse(savedCurrentWeek));
    }
  }, []);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    const today = new Date().toISOString().split('T')[0];
    
    const newDailyMood: DailyMood = {
      date: today,
      mood: value,
      comment: dailyComment
    };

    const updatedWeek = [...currentWeek];
    const existingEntryIndex = updatedWeek.findIndex(entry => entry.date === today);
    
    if (existingEntryIndex >= 0) {
      updatedWeek[existingEntryIndex] = newDailyMood;
    } else {
      updatedWeek.push(newDailyMood);
    }

    setCurrentWeek(updatedWeek);
    localStorage.setItem('currentWeek', JSON.stringify(updatedWeek));
  };

  const handleSaveWeek = () => {
    if (currentWeek.length > 0) {
      const weekStarting = currentWeek[0].date;
      const newWeeklyProgress: WeeklyProgress = {
        weekStarting,
        moods: currentWeek,
        weeklyComment
      };

      const updatedProgress = [...weeklyProgress, newWeeklyProgress];
      setWeeklyProgress(updatedProgress);
      localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));

      // Reset current week
      setCurrentWeek([]);
      setWeeklyComment('');
      localStorage.removeItem('currentWeek');
    }
  };

  const calculateAverageMood = (moods: DailyMood[]) => {
    if (moods.length === 0) return 0;
    const sum = moods.reduce((acc, curr) => acc + curr.mood, 0);
    return sum / moods.length;
  };

  return (
    <TrackerContainer elevation={0}>
      <Typography variant="h6" gutterBottom>
        How are you feeling today?
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <Grid item key={mood.value}>
              <MoodButton
                onClick={() => handleMoodSelect(mood.value)}
                color={selectedMood === mood.value ? "primary" : "default"}
              >
                <Icon fontSize="inherit" />
              </MoodButton>
              <Typography variant="caption" display="block" textAlign="center">
                {mood.label}
              </Typography>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          label="How was your day? (Optional)"
          value={dailyComment}
          onChange={(e) => setDailyComment(e.target.value)}
        />
      </Box>

      <WeeklyProgressContainer>
        <Typography variant="h6" gutterBottom>
          Weekly Progress
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            This Week's Entries: {currentWeek.length} days
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(calculateAverageMood(currentWeek) / 5) * 100} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="Weekly Reflection"
          value={weeklyComment}
          onChange={(e) => setWeeklyComment(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveWeek}
          disabled={currentWeek.length === 0}
        >
          Save Weekly Progress
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Previous Weeks
        </Typography>

        {weeklyProgress.map((week, index) => (
          <Accordion key={week.weekStarting}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Week of {new Date(week.weekStarting).toLocaleDateString()}
                {' - '}
                Average Mood: {calculateAverageMood(week.moods).toFixed(1)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom>
                Daily Entries:
              </Typography>
              {week.moods.map((mood) => (
                <Box key={mood.date} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    {new Date(mood.date).toLocaleDateString()}: {moods[mood.mood - 1].label}
                  </Typography>
                  {mood.comment && (
                    <Typography variant="body2" color="text.secondary">
                      Comment: {mood.comment}
                    </Typography>
                  )}
                </Box>
              ))}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Weekly Reflection:
              </Typography>
              <Typography variant="body2">
                {week.weeklyComment}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </WeeklyProgressContainer>
    </TrackerContainer>
  );
}; 