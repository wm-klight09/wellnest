import React from 'react';
import { QuizResponse } from '../../types/user';
import './QuizResults.css';

interface RecommendationCategory {
  title: string;
  description: string;
  suggestions: string[];
  priority: 'high' | 'medium' | 'low';
}

interface QuizResultsProps {
  responses: QuizResponse;
}

const QuizResults: React.FC<QuizResultsProps> = ({ responses }) => {
  const generateRecommendations = (): RecommendationCategory[] => {
    const recommendations: RecommendationCategory[] = [];

    // Stress Management Recommendations
    if (responses.stressLevel > 7) {
      recommendations.push({
        title: 'Stress Management',
        description: 'Your stress levels are elevated. Here are some techniques to help you manage stress:',
        suggestions: [
          'Practice deep breathing exercises for 5 minutes, 3 times daily',
          'Try progressive muscle relaxation before bed',
          'Take regular breaks during work hours',
          'Consider starting a stress journal to identify triggers'
        ],
        priority: 'high'
      });
    }

    // Sleep Improvement Recommendations
    if (responses.sleepQuality < 6) {
      recommendations.push({
        title: 'Sleep Improvement',
        description: 'Your sleep quality could use some improvement. Consider these suggestions:',
        suggestions: [
          'Establish a consistent sleep schedule',
          'Create a relaxing bedtime routine',
          'Limit screen time before bed',
          'Keep your bedroom cool and dark'
        ],
        priority: responses.sleepQuality < 4 ? 'high' : 'medium'
      });
    }

    // Exercise Recommendations
    if (responses.exerciseFrequency < 3) {
      recommendations.push({
        title: 'Physical Activity',
        description: 'Increasing your physical activity can help improve your mental well-being:',
        suggestions: [
          'Start with 10-minute daily walks',
          'Try beginner-friendly yoga sessions',
          'Join a local fitness class',
          'Find an exercise buddy for motivation'
        ],
        priority: 'medium'
      });
    }

    // Activity Recommendations based on preferences
    if (responses.preferredActivities.length > 0) {
      const activitySuggestions = responses.preferredActivities.map(activity => {
        switch (activity) {
          case 'Meditation':
            return 'Start with 5-minute guided meditation sessions';
          case 'Yoga':
            return 'Try beginner yoga flows on YouTube';
          case 'Running':
            return 'Begin with a walk-run program';
          case 'Swimming':
            return 'Schedule regular pool sessions';
          default:
            return `Incorporate ${activity.toLowerCase()} into your weekly routine`;
        }
      });

      recommendations.push({
        title: 'Personalized Activities',
        description: 'Based on your interests, here are some activities to try:',
        suggestions: activitySuggestions.slice(0, 4),
        priority: 'medium'
      });
    }

    // Mood Improvement Recommendations
    if (responses.currentMood.includes('Negative')) {
      recommendations.push({
        title: 'Mood Enhancement',
        description: 'Here are some strategies to help improve your mood:',
        suggestions: [
          'Practice gratitude journaling',
          'Engage in activities you enjoy',
          'Connect with friends or family',
          'Spend time in nature'
        ],
        priority: 'high'
      });
    }

    // Add general recommendations if needed
    if (recommendations.length < 3) {
      recommendations.push({
        title: 'General Well-being',
        description: 'General tips for maintaining good mental health:',
        suggestions: [
          'Practice mindfulness daily',
          'Maintain a balanced diet',
          'Stay socially connected',
          'Make time for hobbies'
        ],
        priority: 'low'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const recommendations = generateRecommendations();

  return (
    <div className="results-container">
      <h2>Your Personalized Wellness Plan</h2>
      <p className="results-intro">
        Based on your responses, we've created a customized plan to help you achieve your mental health goals.
      </p>

      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <div key={index} className={`recommendation-card priority-${rec.priority}`}>
            <div className="card-header">
              <h3>{rec.title}</h3>
              <span className="priority-badge">{rec.priority}</span>
            </div>
            <p>{rec.description}</p>
            <ul>
              {rec.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="next-steps">
        <h3>Next Steps</h3>
        <div className="steps-grid">
          <div className="step-card">
            <h4>Track Your Progress</h4>
            <p>Use our diary feature to monitor your journey</p>
          </div>
          <div className="step-card">
            <h4>Set Reminders</h4>
            <p>Schedule activities and meditation times</p>
          </div>
          <div className="step-card">
            <h4>Get Support</h4>
            <p>Connect with therapists and wellness experts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 