import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export function useBackendDetection() {
  const [isBackendUp, setIsBackendUp] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        // Ping the actuator health endpoint
        await axios.get(`${API_BASE_URL.replace('/api', '')}/actuator/health`, { timeout: 3000 });
        if (mounted) setIsBackendUp(true);
      } catch (error) {
        if (mounted) setIsBackendUp(false);
      }
    };

    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return isBackendUp;
}
