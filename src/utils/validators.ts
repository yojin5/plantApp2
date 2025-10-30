export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validateUsername = (username: string): { valid: boolean; message: string } => {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true, message: '' };
};

export const validatePlantName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const validateZoneName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const validateSurfaceArea = (area: number): boolean => {
  return area > 0 && area < 10000; // Max 10,000 m²
};

export const validateWateringFrequency = (days: number): boolean => {
  return days >= 1 && days <= 90;
};

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return new Date(endDate) > new Date(startDate);
};