export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ARCHBISHOP' | 'PRIEST' | 'LAITY';
  email: string;
  parishId?: number;
}

export const users: User[] = [
  {
    id: 1,
    username: 'archbishop',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ARCHBISHOP',
    email: 'archbishop@abuja.org'
  },
  {
    id: 2,
    username: 'priest',
    password: 'priest123',
    firstName: 'Michael',
    lastName: 'Smith',
    role: 'PRIEST',
    email: 'priest@parish.org',
    parishId: 1
  },
  {
    id: 3,
    username: 'faithful',
    password: 'faith123',
    firstName: 'Peter',
    lastName: 'Johnson',
    role: 'LAITY',
    email: 'peter@email.com',
    parishId: 1
  }
];

export const parishes = [
  {
    id: 1,
    name: 'Our Lady Queen of Nigeria',
    location: 'Garki, Abuja',
    priest: 'Fr. Michael Smith',
    deanery: 'Garki Deanery',
    phone: '08012345678',
    email: 'ourlady@garki.org',
    massTimes: ['Sunday: 7am, 9am, 11am', 'Weekdays: 6:30am']
  },
  {
    id: 2,
    name: "St. Mary's Catholic Church",
    location: 'Maitama, Abuja',
    priest: 'Fr. James Brown',
    deanery: 'Maitama Deanery',
    phone: '08087654321',
    email: 'stmarys@maitama.org',
    massTimes: ['Sunday: 8am, 10am, 6pm', 'Weekdays: 7am']
  },
  {
    id: 3,
    name: 'Holy Trinity',
    location: 'Wuse, Abuja',
    priest: 'Fr. Paul Okonkwo',
    deanery: 'Wuse Deanery',
    phone: '08023456789',
    email: 'holytrinity@wuse.org',
    massTimes: ['Sunday: 6:30am, 8:30am, 10:30am', 'Weekdays: 6:30am, 7:30am']
  }
];

export const events = [
  {
    id: 1,
    title: 'Archdiocesan Youth Gathering',
    date: '2024-04-15',
    time: '10:00 AM',
    parish: 'Our Lady Queen of Nigeria',
    description: 'Annual youth gathering with games and activities',
    type: 'youth'
  },
  {
    id: 2,
    title: "Priests' Council Meeting",
    date: '2024-04-10',
    time: '2:00 PM',
    location: 'Catholic Secretariat',
    description: 'Monthly meeting of all priests',
    type: 'clergy'
  },
  {
    id: 3,
    title: 'Easter Novena',
    date: '2024-03-25',
    time: '6:00 PM',
    parish: 'All Parishes',
    description: 'Nine days of prayer before Easter',
    type: 'worship'
  }
];

export const sacramentRecords = [
  {
    id: 1,
    memberName: 'Chioma Okafor',
    sacramentType: 'BAPTISM',
    dateReceived: '2024-01-15',
    parish: 'Our Lady Queen of Nigeria',
    minister: 'Fr. Michael Smith'
  },
  {
    id: 2,
    memberName: 'Emeka Nwachukwu',
    sacramentType: 'MARRIAGE',
    dateReceived: '2024-02-10',
    parish: "St. Mary's",
    minister: 'Fr. James Brown'
  }
];

export const announcements = [
  {
    id: 1,
    title: "Archbishop's Lenten Message",
    content: 'Let us use this season for prayer and almsgiving...',
    date: '2024-03-01',
    priority: 'high',
    author: 'Archbishop John Doe'
  },
  {
    id: 2,
    title: 'New Parish Priests Appointed',
    content: 'We welcome our new parish priests...',
    date: '2024-03-05',
    priority: 'medium',
    author: "Chancellor's Office"
  }
];
