import React from 'react';
import {
  Container,
  Typography,
  styled,
} from '@mui/material';
import { MoodTracker } from '../components/tracker/MoodTracker';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(8), // Space for bottom navigation
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const MoodPage: React.FC = () => {
  return (
    <PageContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Mood Tracker
      </Typography>
      <MoodTracker />
    </PageContainer>
  );
};

export default MoodPage; 