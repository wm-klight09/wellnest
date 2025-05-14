import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const InspirationContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden'
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  position: 'absolute',
  fontSize: '5rem',
  opacity: 0.1,
  right: -10,
  bottom: -10,
}));

const quotes = [
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
    author: "Lori Deschene"
  },
  {
    text: "Self-care is not selfish. You cannot serve from an empty vessel.",
    author: "Eleanor Brown"
  }
];

export const DailyInspiration: React.FC = () => {
  const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <InspirationContainer elevation={0}>
      <Typography variant="h6" gutterBottom>
        Daily Inspiration
      </Typography>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body1" paragraph>
          "{todaysQuote.text}"
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          - {todaysQuote.author}
        </Typography>
      </Box>
      <QuoteIcon />
    </InspirationContainer>
  );
}; 