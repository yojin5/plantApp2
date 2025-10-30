export const STORAGE_KEYS = {
  USERS: 'users',
  PLANTS: 'plants',
  ZONES: 'plant_zones',
  POSTS: 'posts',
  HELP_REQUESTS: 'help_requests',
  CURRENT_USER: 'current_user',
  NOTIFICATIONS: 'notifications',
};

export const PLANT_TYPES = [
  'Tropical',
  'Succulent',
  'Fern',
  'Flowering',
  'Herb',
  'Cactus',
  'Vine',
  'Tree',
];

export const WATERING_FREQUENCIES = {
  DAILY: 1,
  EVERY_2_DAYS: 2,
  EVERY_3_DAYS: 3,
  WEEKLY: 7,
  BIWEEKLY: 14,
  MONTHLY: 30,
};

export const RAINFALL_THRESHOLD = 5; // mm - Heavy rain threshold
export const COVERAGE_FACTORS = {
  UNCOVERED: 1.0,
  PARTIAL_COVER: 0.6,
  FULL_COVER: 0.3,
};