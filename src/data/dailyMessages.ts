export const dailyMessages = [
  "Every day is a fresh start to create positive change in your life.",
  "You have the strength within you to overcome any challenge.",
  "Your mental health matters. Take time to nurture your mind today.",
  "Small steps forward are still progress. Be proud of every effort.",
  "You are worthy of peace, joy, and all good things in life.",
  "Today is an opportunity to grow, learn, and become stronger.",
  "Your feelings are valid. It's okay to feel, and it's okay to heal.",
  "Remember to breathe. Each breath is a moment to reset and refocus.",
  "You are not alone. Your journey is unique and valuable.",
  "Plant seeds of positivity today for a brighter tomorrow.",
  "Your potential is limitless. Believe in your ability to grow.",
  "Take a moment to appreciate how far you've come.",
  "Every act of self-care is an investment in your wellbeing.",
  "You have the power to shape your thoughts and your day.",
  "Embrace your journey. Progress isn't always linear, and that's okay.",
  "Your presence makes the world a better place.",
  "Today, choose self-compassion over self-criticism.",
  "You are stronger than you think and braver than you believe.",
  "Find peace in the present moment. It's where life happens.",
  "Your mental health journey is important. Take it one day at a time.",
  // Add more messages to have at least 183 (half a year) unique messages
  // ... continuing with more messages to ensure variety
];

export const getMessageForDay = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Use modulo to get a message based on the day of the year
  // This ensures the same message appears on the same day each year
  return dailyMessages[dayOfYear % dailyMessages.length];
}; 