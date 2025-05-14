import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  styled,
} from '@mui/material';
import {
  Home as HomeIcon,
  MoodRounded as MoodIcon,
  SelfImprovement as SelfImprovementIcon,
} from '@mui/icons-material';

const StyledBottomNav = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: theme.spacing(1), // Add padding for iOS safe area
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
}));

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <StyledBottomNav elevation={3}>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          '& .Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.875rem',
              transition: 'font-size 0.2s',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Mood"
          value="/mood"
          icon={<MoodIcon />}
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<HomeIcon />}
          sx={{ minWidth: 'auto' }}
        />
        <BottomNavigationAction
          label="Wellness"
          value="/wellness"
          icon={<SelfImprovementIcon />}
          sx={{ minWidth: 'auto' }}
        />
      </BottomNavigation>
    </StyledBottomNav>
  );
};

export default BottomNav; 