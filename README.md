# WELLNEST - Mental Health & Wellness Application

WELLNEST is a comprehensive mental health and wellness application designed to help users track their daily activities, monitor weather conditions, and maintain their overall well-being.

## Features

- **Activity Tracking**
  - Track daily wellness activities (exercise, meditation, hydration, sleep)
  - Visual progress indicators
  - Local storage persistence
  - Responsive grid layout with activity cards

- **Weather Integration**
  - Real-time weather data using OpenWeather API
  - Temperature display (°C)
  - Sunrise and sunset times
  - City search functionality
  - Geolocation support

- **Modern UI Design**
  - Glassmorphism effects
  - Smooth animations
  - Responsive layout
  - Calming color scheme

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd wellnest
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeather API key:
```
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
wellnest/
├── src/
│   ├── components/
│   │   ├── activities/
│   │   │   └── ActivityTracker.tsx
│   │   └── weather/
│   │       └── WeatherSunlight.tsx
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenWeather API for weather data
- Material-UI for the component library
- React community for inspiration and support
