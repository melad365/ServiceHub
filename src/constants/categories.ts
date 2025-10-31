/**
 * Service categories and related constants
 */

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // MaterialCommunityIcons name
  description: string;
  color: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'plumber',
    name: 'Plumbing',
    icon: 'pipe-wrench',
    description: 'Pipe repairs, installations, and maintenance',
    color: '#3498db',
  },
  {
    id: 'electrician',
    name: 'Electrical',
    icon: 'lightning-bolt',
    description: 'Electrical repairs and installations',
    color: '#f39c12',
  },
  {
    id: 'cleaner',
    name: 'Cleaning',
    icon: 'broom',
    description: 'Home and office cleaning services',
    color: '#2ecc71',
  },
  {
    id: 'painter',
    name: 'Painting',
    icon: 'format-paint',
    description: 'Interior and exterior painting',
    color: '#e74c3c',
  },
  {
    id: 'carpenter',
    name: 'Carpentry',
    icon: 'hammer',
    description: 'Woodwork and furniture repairs',
    color: '#8e44ad',
  },
  {
    id: 'hvac',
    name: 'HVAC',
    icon: 'air-conditioner',
    description: 'Heating, ventilation, and air conditioning',
    color: '#1abc9c',
  },
  {
    id: 'gardener',
    name: 'Gardening',
    icon: 'flower',
    description: 'Lawn care and landscaping',
    color: '#27ae60',
  },
  {
    id: 'locksmith',
    name: 'Locksmith',
    icon: 'key',
    description: 'Lock repairs and key services',
    color: '#95a5a6',
  },
  {
    id: 'handyman',
    name: 'Handyman',
    icon: 'tools',
    description: 'General repairs and maintenance',
    color: '#34495e',
  },
  {
    id: 'mover',
    name: 'Moving',
    icon: 'truck',
    description: 'Moving and transportation services',
    color: '#16a085',
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    icon: 'bug',
    description: 'Pest elimination and prevention',
    color: '#c0392b',
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    icon: 'washing-machine',
    description: 'Home appliance repairs',
    color: '#2980b9',
  },
];

export const getCategoryById = (id: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryName = (id: string): string => {
  return getCategoryById(id)?.name || id;
};
