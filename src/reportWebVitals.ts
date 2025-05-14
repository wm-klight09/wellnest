import { Metric, onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = async (onPerfEntry?: (metric: Metric) => void): Promise<void> => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    try {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    } catch (error) {
      console.error('Error reporting web vitals:', error);
    }
  }
};

export default reportWebVitals;
