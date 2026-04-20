
import { useState } from 'react';
import { UserPreferences } from '../types';
import { DEFAULT_AGE_RANGE, DEFAULT_DISTANCE } from '../constants';

export const useFilters = () => {
  const [filters, setFilters] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('filters_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      ageRange: DEFAULT_AGE_RANGE,
      maxDistance: DEFAULT_DISTANCE,
      heritage: [],
      prioritizeBackground: false,
      dynamics: [],
      interests: [],
      lookingFor: [],
      coupleType: [],
      gendersOpenTo: []
    };
  });

  const updateFilter = (key: keyof UserPreferences, value: any) => {
    setFilters(prev => {
      let newFilters;
      if (key === 'ageRange') {
        const [min, max] = value as [number, number];
        newFilters = { ...prev, [key]: [Math.max(18, min), max] };
      } else {
        newFilters = { ...prev, [key]: value };
      }
      localStorage.setItem('filters_state', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const applyFilters = () => {
    // console.log("[Filters] Applying parameters to Matching Stack:", filters);
    localStorage.setItem('filters_state', JSON.stringify(filters));
  };

  const resetToDefaults = () => {
    const defaults = {
      ageRange: DEFAULT_AGE_RANGE,
      maxDistance: DEFAULT_DISTANCE,
      heritage: [],
      prioritizeBackground: false,
      dynamics: [],
      interests: [],
      lookingFor: [],
      coupleType: [],
      gendersOpenTo: []
    };
    setFilters(defaults);
    localStorage.setItem('filters_state', JSON.stringify(defaults));
  };

  return { filters, setFilters, updateFilter, applyFilters, resetToDefaults };
};
