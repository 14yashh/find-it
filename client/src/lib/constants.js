// Application Constants matching docs/API.md and college specifications

export const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence and Data Science',
  'Electronics and Telecommunications',
  'Chemical Engineering',
];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
  value: dept,
  label: dept,
}));

export const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'id_cards', label: 'ID Cards' },
  { value: 'bags', label: 'Bags' },
  { value: 'keys', label: 'Keys' },
  { value: 'books', label: 'Books' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
];

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...CATEGORIES,
];

export const ITEM_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
];

export const ITEM_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'claim_pending', label: 'Claim Pending' },
  { value: 'returned', label: 'Returned' },
  { value: 'expired', label: 'Expired' },
];

export const YEARS = [
  { value: '1st Year', label: '1st Year (Freshman)' },
  { value: '2nd Year', label: '2nd Year (Sophomore)' },
  { value: '3rd Year', label: '3rd Year (Junior)' },
  { value: '4th Year', label: '4th Year (Senior)' },
  { value: 'Graduate / Post-Grad', label: 'Graduate / Post-Grad' },
];

export const QUICK_LOCATIONS = [
  'Student Lounge',
  'OB Canteen',
  'NB Seminar Hall',
];
