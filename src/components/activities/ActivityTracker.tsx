import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Stack,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import ParkIcon from '@mui/icons-material/Park';
import PoolIcon from '@mui/icons-material/Pool';

const ActivityContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(2),
}));

interface Activity {
  id: string;
  type: string;
  duration: number;
  notes: string;
  date: string;
}

interface WeeklyReport {
  weekStarting: string;
  activities: Activity[];
  totalDuration: number;
  summary: string;
}

const activityTypes = [
  { value: 'exercise', label: 'Exercise', icon: FitnessCenterIcon },
  { value: 'running', label: 'Running', icon: DirectionsRunIcon },
  { value: 'yoga', label: 'Yoga', icon: SelfImprovementIcon },
  { value: 'walking', label: 'Walking', icon: ParkIcon },
  { value: 'swimming', label: 'Swimming', icon: PoolIcon },
];

export const ActivityTracker: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [newActivity, setNewActivity] = useState({
    type: '',
    duration: '',
    notes: '',
  });

  useEffect(() => {
    // Load saved activities and reports from localStorage
    const savedActivities = localStorage.getItem('activities');
    const savedReports = localStorage.getItem('activityReports');
    
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
    if (savedReports) {
      setWeeklyReports(JSON.parse(savedReports));
    }
  }, []);

  const handleAddActivity = () => {
    if (!newActivity.type || !newActivity.duration) return;

    const activity: Activity = {
      id: Date.now().toString(),
      type: newActivity.type,
      duration: Number(newActivity.duration),
      notes: newActivity.notes,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));

    setNewActivity({
      type: '',
      duration: '',
      notes: '',
    });
  };

  const handleDeleteActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };

  const generateWeeklyReport = () => {
    if (activities.length === 0) return;

    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
    
    const weekActivities = activities.filter(activity => activity.date >= weekStart);
    const totalDuration = weekActivities.reduce((sum, activity) => sum + activity.duration, 0);

    const report: WeeklyReport = {
      weekStarting: weekStart,
      activities: weekActivities,
      totalDuration,
      summary: `Completed ${weekActivities.length} activities totaling ${totalDuration} minutes this week.`,
    };

    const updatedReports = [...weeklyReports, report];
    setWeeklyReports(updatedReports);
    localStorage.setItem('activityReports', JSON.stringify(updatedReports));

    // Clear this week's activities
    const remainingActivities = activities.filter(activity => activity.date < weekStart);
    setActivities(remainingActivities);
    localStorage.setItem('activities', JSON.stringify(remainingActivities));
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    if (activityType) {
      const Icon = activityType.icon;
      return <Icon />;
    }
    return null;
  };

  return (
    <Box>
      <ActivityContainer>
        <Typography variant="h6" gutterBottom>
          Log New Activity
        </Typography>
        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            label="Activity Type"
            value={newActivity.type}
            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
          >
            {activityTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {React.createElement(type.icon)}
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Duration (minutes)"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes (optional)"
            value={newActivity.notes}
            onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddActivity}
            disabled={!newActivity.type || !newActivity.duration}
          >
            Add Activity
          </Button>
        </Stack>
      </ActivityContainer>

      <ActivityContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            This Week's Activities
          </Typography>
          <Button
            variant="outlined"
            onClick={generateWeeklyReport}
            disabled={activities.length === 0}
          >
            Generate Weekly Report
          </Button>
        </Box>
        
        <Stack spacing={1}>
          {activities.map((activity) => (
            <Paper
              key={activity.id}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getActivityIcon(activity.type)}
                <Box>
                  <Typography variant="subtitle1">
                    {activityTypes.find(t => t.value === activity.type)?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.duration} minutes
                  </Typography>
                  {activity.notes && (
                    <Typography variant="body2" color="text.secondary">
                      {activity.notes}
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => handleDeleteActivity(activity.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      </ActivityContainer>

      <ActivityContainer>
        <Typography variant="h6" gutterBottom>
          Weekly Reports
        </Typography>
        {weeklyReports.map((report) => (
          <Accordion
            key={report.weekStarting}
            sx={{ background: 'rgba(255, 255, 255, 0.5)', mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>
                  Week of {new Date(report.weekStarting).toLocaleDateString()}
                </Typography>
                <Chip
                  label={`${report.totalDuration} mins`}
                  size="small"
                  color="primary"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom>
                {report.summary}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Stack spacing={1}>
                {report.activities.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                    <Typography variant="body2">
                      {activityTypes.find(t => t.value === activity.type)?.label}
                      {' - '}
                      {activity.duration} minutes
                      {activity.notes && ` - ${activity.notes}`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </ActivityContainer>
    </Box>
  );
}; 