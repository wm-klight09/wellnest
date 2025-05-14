import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    text: "How often do you feel stressed or overwhelmed?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    id: 3,
    text: "How would you rate your sleep quality over the past week?",
    options: ["Very good", "Good", "Poor", "Very poor"],
  },
  {
    id: 4,
    text: "How often do you engage in physical activity or exercise?",
    options: ["Daily", "Few times a week", "Once a week", "Rarely"],
  },
  {
    id: 5,
    text: "How would you describe your energy levels throughout the day?",
    options: ["Consistently high", "Mostly stable", "Fluctuating", "Usually low"],
  },
  {
    id: 6,
    text: "How often do you feel anxious or worried?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    id: 7,
    text: "How satisfied are you with your social connections and relationships?",
    options: ["Very satisfied", "Satisfied", "Somewhat satisfied", "Not satisfied"],
  },
  {
    id: 8,
    text: "How well can you concentrate on tasks?",
    options: ["Very well", "Well", "With difficulty", "With great difficulty"],
  },
];

const QuizContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  height: 10,
  borderRadius: 5,
}));

const MentalHealthQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: questions[currentQuestion].options.indexOf(value),
    }));
  };

  const calculateResults = () => {
    const scores = {
      stress: 0,
      mood: 0,
      wellbeing: 0,
    };

    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionId, answerIndex]) => {
      const qId = parseInt(questionId);
      
      // Stress score (questions 2, 6)
      if ([2, 6].includes(qId)) {
        scores.stress += (3 - answerIndex); // Reverse score
      }
      
      // Mood score (questions 1, 5, 8)
      if ([1, 5, 8].includes(qId)) {
        scores.mood += (3 - answerIndex); // Reverse score
      }
      
      // Wellbeing score (questions 3, 4, 7)
      if ([3, 4, 7].includes(qId)) {
        scores.wellbeing += (3 - answerIndex); // Reverse score
      }
    });

    return scores;
  };

  const getRecommendations = (results: { stress: number; mood: number; wellbeing: number }) => {
    const recommendations = {
      stress: [] as string[],
      mood: [] as string[],
      wellbeing: [] as string[],
      activities: [] as string[]
    };

    // Stress recommendations
    if ((results.stress / 6) * 100 > 50) {
      recommendations.stress = [
        "Practice deep breathing exercises for 5 minutes, three times a day",
        "Take regular breaks during work hours",
        "Try mindfulness meditation using our guided sessions",
        "Create a calming bedtime routine"
      ];
    }

    // Mood recommendations
    if ((results.mood / 9) * 100 < 70) {
      recommendations.mood = [
        "Spend at least 30 minutes outside in natural daylight",
        "Connect with a friend or family member daily",
        "Start a gratitude journal",
        "Listen to uplifting music or podcasts"
      ];
    }

    // Wellbeing recommendations
    if ((results.wellbeing / 9) * 100 < 70) {
      recommendations.wellbeing = [
        "Establish a consistent sleep schedule",
        "Take a 15-minute walk after meals",
        "Join a local community group or class",
        "Practice a hobby you enjoy for at least 30 minutes daily"
      ];
    }

    // Physical activities based on overall scores
    const avgScore = (results.stress + results.mood + results.wellbeing) / 3;
    if (avgScore < 15) {
      recommendations.activities = [
        "Start with gentle stretching exercises",
        "Try a beginner yoga session",
        "Take short walks during breaks",
        "Do light bodyweight exercises at home"
      ];
    } else {
      recommendations.activities = [
        "Join a fitness class or group activity",
        "Try high-intensity interval training (HIIT)",
        "Go for a 30-minute jog or bike ride",
        "Practice strength training exercises"
      ];
    }

    return recommendations;
  };

  const handleNext = () => {
    if (!(questions[currentQuestion].id in answers)) {
      setError('Please select an answer before continuing');
      return;
    }
    setError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const results = calculateResults();
      localStorage.setItem('wellnest_quiz_results', JSON.stringify(results));
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    navigate('/'); // Navigate to dashboard or home
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const results = calculateResults();
    const recommendations = getRecommendations(results);
    
    return (
      <QuizContainer>
        <Typography variant="h5" gutterBottom align="center">
          Your Mental Health Assessment Results
        </Typography>

        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Stress Level
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(results.stress / 6) * 100}
            sx={{ height: 20, borderRadius: 2, mb: 2 }}
          />

          <Typography variant="h6" gutterBottom>
            Mood
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(results.mood / 9) * 100}
            sx={{ height: 20, borderRadius: 2, mb: 2 }}
          />

          <Typography variant="h6" gutterBottom>
            Overall Wellbeing
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(results.wellbeing / 9) * 100}
            sx={{ height: 20, borderRadius: 2 }}
          />
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Your Personalized Recommendations
          </Typography>

          {recommendations.stress.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Stress Management
              </Typography>
              {recommendations.stress.map((rec, index) => (
                <Typography key={index} variant="body1" paragraph>
                  • {rec}
                </Typography>
              ))}
            </Box>
          )}

          {recommendations.mood.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Mood Improvement
              </Typography>
              {recommendations.mood.map((rec, index) => (
                <Typography key={index} variant="body1" paragraph>
                  • {rec}
                </Typography>
              ))}
            </Box>
          )}

          {recommendations.wellbeing.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Overall Wellbeing
              </Typography>
              {recommendations.wellbeing.map((rec, index) => (
                <Typography key={index} variant="body1" paragraph>
                  • {rec}
                </Typography>
              ))}
            </Box>
          )}

          <Box mb={3}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Recommended Physical Activities
            </Typography>
            {recommendations.activities.map((rec, index) => (
              <Typography key={index} variant="body1" paragraph>
                • {rec}
              </Typography>
            ))}
          </Box>

          <Typography variant="body1" paragraph>
            Based on your responses, we've created these personalized recommendations to help improve your mental wellness.
            Try to incorporate these activities into your daily routine gradually.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleComplete}
          >
            Start Your Wellness Journey
          </Button>
        </Box>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <Typography variant="h5" gutterBottom align="center">
        Mental Health Assessment
      </Typography>

      <ProgressBar variant="determinate" value={progress} />

      <Typography variant="h6" gutterBottom>
        Question {currentQuestion + 1} of {questions.length}
      </Typography>

      <Typography variant="body1" paragraph>
        {questions[currentQuestion].text}
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup
          value={answers[questions[currentQuestion].id] !== undefined
            ? questions[currentQuestion].options[answers[questions[currentQuestion].id]]
            : ''}
          onChange={(e) => handleAnswer(e.target.value)}
        >
          {questions[currentQuestion].options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleNext}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
        </Button>
      </Box>
    </QuizContainer>
  );
};

export default MentalHealthQuiz; 