import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import BottomNav from './components/navigation/BottomNavigation';
import Home from './pages/Home';
import MoodPage from './pages/Mindfulness';
import Wellness from './pages/Wellness';
import Registration from './components/auth/Registration';
import MentalHealthQuiz from './components/quiz/MentalHealthQuiz';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ paddingBottom: '56px' }}> {/* Space for bottom navigation */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/quiz" element={<MentalHealthQuiz />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
