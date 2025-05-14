import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  height: {
    feet: string;
    inches: string;
  };
  weight: string;
  age: string;
  gender: string;
}

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  maxWidth: 600,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    height: { feet: '', inches: '' },
    weight: '',
    age: '',
    gender: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    if (field === 'feet' || field === 'inches') {
      setFormData(prev => ({
        ...prev,
        height: {
          ...prev.height,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.name || !formData.age || !formData.gender) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const convertToMetric = () => {
    // Convert height from ft/in to cm
    const totalInches = (parseInt(formData.height.feet) * 12) + parseInt(formData.height.inches);
    const heightInCm = totalInches * 2.54;
    
    // Convert weight from lbs to kg
    const weightInKg = parseInt(formData.weight) * 0.453592;

    return {
      heightCm: Math.round(heightInCm),
      weightKg: Math.round(weightInKg),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const metricMeasurements = convertToMetric();
    
    // Here you would typically send the data to your backend
    // For now, we'll store it in localStorage and redirect
    try {
      const userData = {
        ...formData,
        ...metricMeasurements,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('wellnest_user', JSON.stringify(userData));
      navigate('/quiz'); // Redirect to the mental health quiz
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <FormContainer>
      <Typography variant="h5" gutterBottom align="center">
        Create Your WELLNEST Account
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              helperText="Minimum 8 characters"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Height (ft)"
              value={formData.height.feet}
              onChange={(e) => handleChange('feet', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Height (in)"
              value={formData.height.inches}
              onChange={(e) => handleChange('inches', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Weight (lbs)"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                label="Gender"
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Create Account
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );
};

export default Registration; 