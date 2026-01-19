import { ComplaintStatus, ServiceType, Complaint, Bill, WiFiPlan, AppNotification } from './types';

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'C-001',
    userId: 'U-101',
    userName: 'Rajesh Kumar',
    type: ServiceType.ELECTRICITY,
    category: 'Power Outage',
    description: 'The whole block has been without power since 2 PM. Possible transformer failure.',
    location: 'Mangalore City, Sector 15',
    branch: 'Mangalore City',
    status: ComplaintStatus.SOLVING,
    priority: 'HIGH',
    createdAt: '2023-10-25T14:00:00Z',
    updatedAt: '2023-10-25T15:30:00Z',
  },
  {
    id: 'C-002',
    userId: 'U-102',
    userName: 'Anita Shenoy',
    type: ServiceType.WIFI,
    category: 'Slow Internet',
    description: 'Fiber connection speed is below 2Mbps for the last 3 hours.',
    location: 'Bantwal, Market Road',
    branch: 'Bantwal',
    status: ComplaintStatus.PENDING,
    priority: 'MEDIUM',
    createdAt: '2023-10-26T09:00:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
  },
  {
    id: 'C-003',
    userId: 'U-103',
    userName: 'Karthik Prabhu',
    type: ServiceType.ELECTRICITY,
    category: 'Voltage Fluctuation',
    description: 'Heavy flickering in residential lines.',
    location: 'Puttur, Bypass Area',
    branch: 'Puttur',
    status: ComplaintStatus.PENDING,
    priority: 'HIGH',
    createdAt: '2023-10-27T10:00:00Z',
    updatedAt: '2023-10-27T10:00:00Z',
  },
  {
    id: 'C-004',
    userId: 'U-104',
    userName: 'Suresh Bhat',
    type: ServiceType.WIFI,
    category: 'Connection Loss',
    description: 'Router red light is blinking since morning.',
    location: 'Mangalore City, MG Road',
    branch: 'Mangalore City',
    status: ComplaintStatus.RESOLVED,
    priority: 'MEDIUM',
    createdAt: '2023-10-24T08:00:00Z',
    updatedAt: '2023-10-24T12:00:00Z',
    staffNotes: 'Technician replaced the connector at the DP box.'
  }
];

export const MOCK_BILLS: Bill[] = [
  { id: 'B-001', userId: 'U-101', userName: 'Rajesh Kumar', type: ServiceType.ELECTRICITY, amount: 4550.00, dueDate: '2023-11-05', status: 'UNPAID', period: 'Oct 2023', branch: 'Mangalore City', unitsConsumed: 450 },
  { id: 'B-002', userId: 'U-102', userName: 'Anita Shenoy', type: ServiceType.WIFI, amount: 999.00, dueDate: '2023-11-01', status: 'PAID', period: 'Oct 2023', branch: 'Bantwal' },
  { id: 'B-003', userId: 'U-103', userName: 'Karthik Prabhu', type: ServiceType.WIFI, amount: 999.00, dueDate: '2023-12-01', status: 'UNPAID', period: 'Nov 2023', branch: 'Puttur' },
  { id: 'B-004', userId: 'U-104', userName: 'Suresh Bhat', type: ServiceType.ELECTRICITY, amount: 3240.00, dueDate: '2023-10-05', status: 'PAID', period: 'Sep 2023', branch: 'Mangalore City', unitsConsumed: 320 },
  { id: 'B-005', userId: 'U-105', userName: 'Divya Hegde', type: ServiceType.WIFI, amount: 999.00, dueDate: '2023-10-01', status: 'PAID', period: 'Sep 2023', branch: 'Moodabidri' },
];

export const WIFI_PLANS: WiFiPlan[] = [
  { id: 'W-01', name: 'Coastal Fiber Basic', speed: '50 Mbps', dataLimit: 'Unlimited', price: 399 },
  { id: 'W-02', name: 'District Streamer Pro', speed: '200 Mbps', dataLimit: 'Unlimited', price: 649 },
  { id: 'W-03', name: 'Mangalore Giga Speed', speed: '500 Mbps', dataLimit: 'Unlimited', price: 999 },
];

export const DK_BRANCHES = [
  'Central Head Office',
  'Mangalore City',
  'Bantwal',
  'Puttur',
  'Belthangady',
  'Sullia',
  'Moodabidri',
  'Kadaba',
  'Ullal'
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N-001',
    title: 'Bill Generated',
    message: 'Your electricity bill for Oct 2023 (₹4,550) has been generated.',
    type: 'INFO',
    timestamp: '2023-10-28T10:00:00Z',
    read: false
  },
  {
    id: 'N-002',
    title: 'Maintenance Alert',
    message: 'Scheduled maintenance in Mangalore City branch on Oct 30, 11 PM.',
    type: 'MAINTENANCE',
    timestamp: '2023-10-27T15:30:00Z',
    read: false
  },
  {
    id: 'N-003',
    title: 'Payment Successful',
    message: 'Thank you! Your WiFi bill payment of ₹999 was successful.',
    type: 'SUCCESS',
    timestamp: '2023-10-26T11:20:00Z',
    read: true
  }
];