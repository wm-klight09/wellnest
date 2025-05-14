import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface Message {
  text: string;
  author?: string;
  category: 'affirmation' | 'quote' | 'tip';
}

const messages: Message[] = [
  {
    text: "I am capable of handling whatever challenges come my way",
    category: "affirmation"
  },
  {
    text: "Every day is a new opportunity for growth and healing",
    category: "affirmation"
  },
  {
    text: "I choose peace and positivity in my life",
    category: "affirmation"
  },
  {
    text: "The only way to do great work is to love what you do",
    author: "Steve Jobs",
    category: "quote"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions",
    author: "Dalai Lama",
    category: "quote"
  },
  {
    text: "Take a few deep breaths when feeling overwhelmed",
    category: "tip"
  },
  {
    text: "Practice gratitude by noting three good things each day",
    category: "tip"
  },
  {
    text: "Small steps lead to big changes",
    category: "affirmation"
  },
  {
    text: "The future depends on what you do today",
    author: "Mahatma Gandhi",
    category: "quote"
  },
  {
    text: "Take regular breaks to stretch and move your body",
    category: "tip"
  }
];

const MessageContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  position: 'relative',
  overflow: 'hidden',
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  position: 'absolute',
  fontSize: '120px',
  opacity: 0.1,
  right: -20,
  bottom: -20,
}));

const DailyMessage: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  useEffect(() => {
    // Try to get the last message and its timestamp from localStorage
    const savedMessage = localStorage.getItem('wellnest_daily_message');
    const savedTimestamp = localStorage.getItem('wellnest_message_timestamp');
    
    if (savedMessage && savedTimestamp) {
      const lastUpdate = new Date(savedTimestamp);
      const now = new Date();
      
      // Check if it's still the same day
      if (lastUpdate.toDateString() === now.toDateString()) {
        setCurrentMessage(JSON.parse(savedMessage));
        return;
      }
    }
    
    // If no saved message or it's a new day, get a new message
    const newMessage = getRandomMessage();
    setCurrentMessage(newMessage);
    localStorage.setItem('wellnest_daily_message', JSON.stringify(newMessage));
    localStorage.setItem('wellnest_message_timestamp', new Date().toISOString());
  }, []);

  const handleRefresh = () => {
    setFadeIn(false);
    setTimeout(() => {
      const newMessage = getRandomMessage();
      setCurrentMessage(newMessage);
      setFadeIn(true);
      localStorage.setItem('wellnest_daily_message', JSON.stringify(newMessage));
      localStorage.setItem('wellnest_message_timestamp', new Date().toISOString());
    }, 300);
  };

  if (!currentMessage) return null;

  return (
    <MessageContainer>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Daily Inspiration
        </Typography>
        <IconButton onClick={handleRefresh} size="small">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Fade in={fadeIn} timeout={300}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontStyle: 'italic' }}>
            {currentMessage.text}
          </Typography>
          
          {currentMessage.author && (
            <Typography variant="body2" color="text.secondary">
              — {currentMessage.author}
            </Typography>
          )}
        </Box>
      </Fade>

      <QuoteIcon />
    </MessageContainer>
  );
};

export default DailyMessage; 