
import { useContext } from 'react';
import { PlatformContext } from '../context/PlatformContext';
import { PlatformContextType } from '../types';

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
