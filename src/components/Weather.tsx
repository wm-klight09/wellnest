import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import { styled } from '@mui/material/styles';

const WeatherContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

interface WeatherData {
  temperature: number;
  condition: string;
}

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated weather data - replace with actual API call
    setTimeout(() => {
      setWeather({
        temperature: 22,
        condition: 'Sunny'
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <WeatherContainer elevation={0}>
      {weather?.condition === 'Sunny' ? <WbSunnyIcon /> : <CloudIcon />}
      <Box>
        <Typography variant="h6">
          {weather?.temperature}°C
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {weather?.condition}
        </Typography>
      </Box>
    </WeatherContainer>
  );
}; 