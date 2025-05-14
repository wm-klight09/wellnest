import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  styled,
} from '@mui/material';
import { Weather } from '../components/Weather';
import { DailyInspiration } from '../components/DailyInspiration';
import MentalHealthQuiz from '../components/quiz/MentalHealthQuiz';

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
  transition: 'transform 0.2s ease-in-out',
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const Home: React.FC = () => {
  return (
    <PageContainer maxWidth="sm">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Wellnest
        </Typography>
      </Box>

      <ContentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Weather
          </Typography>
          <Weather />
        </CardContent>
      </ContentCard>

      <ContentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Inspiration
          </Typography>
          <DailyInspiration />
        </CardContent>
      </ContentCard>

      <ContentCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mental Health Check
          </Typography>
          <MentalHealthQuiz />
        </CardContent>
      </ContentCard>
    </PageContainer>
  );
};

export default Home; 