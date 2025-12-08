import { useState, useCallback } from 'react';

export const useTourGuide = () => {
  const [isTourActive, setIsTourActive] = useState(false);

  const startTour = useCallback(() => {
    setIsTourActive(true);
    localStorage.setItem('tour_started', 'true');
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem('tour_started');
    setIsTourActive(false);
  }, []);

  const shouldShowTour = useCallback(() => {
    return !localStorage.getItem('tour_started');
  }, []);

  return {
    isTourActive,
    startTour,
    endTour,
    resetTour,
    shouldShowTour,
  };
};

