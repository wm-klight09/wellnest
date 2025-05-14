import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const API_KEY = '27328d02cb588d125a94d6605ae207e5';

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  sunrise: number;
  sunset: number;
  city: string;
}

const WeatherContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const WeatherSunlight: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');

  const fetchWeatherData = async (searchCity: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      
      setWeather({
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        city: data.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`
          );
          
          if (!response.ok) {
            throw new Error('Location not found');
          }

          const data = await response.json();
          setCity(data.name);
          setWeather({
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            description: data.weather[0].description,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            city: data.name,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      });
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <WeatherContainer>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          size="small"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <IconButton onClick={handleSearch} color="primary">
          <SearchIcon />
        </IconButton>
        <IconButton onClick={handleGetLocation} color="primary">
          <LocationOnIcon />
        </IconButton>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {weather && !loading && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {weather.city}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            <WbSunnyIcon />
            <Typography variant="h4">
              {Math.round(weather.temp)}°C
            </Typography>
          </Box>
          
          <Typography variant="body2" color="textSecondary">
            Feels like: {Math.round(weather.feels_like)}°C
          </Typography>
          
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {weather.description}
          </Typography>
          
          <Box mt={2}>
            <Typography variant="body2">
              Sunrise: {formatTime(weather.sunrise)}
            </Typography>
            <Typography variant="body2">
              Sunset: {formatTime(weather.sunset)}
            </Typography>
          </Box>
        </Box>
      )}
    </WeatherContainer>
  );
};

export default WeatherSunlight; 