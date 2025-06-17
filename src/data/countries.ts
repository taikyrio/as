import { Country } from '../types/GameTypes';

export const countries: Country[] = [
  {
    id: 'usa',
    name: 'United States',
    currency: 'USD',
    exchangeRate: 1.0,
    educationSystem: {
      primaryYears: 6,
      secondaryYears: 6,
      tertiaryOptions: ['Community College', 'University', 'Technical School'],
      quality: 85
    },
    jobMarket: {
      unemploymentRate: 4.2,
      averageSalary: 65000,
      popularCareers: ['Software Engineer', 'Nurse', 'Teacher'],
      growth: 3.2
    },
    crimeRate: 47.81,
    healthcare: {
      quality: 90,
      cost: 85,
      publicSystem: false
    },
    costOfLiving: {
      housing: 1200,
      food: 400,
      transportation: 300,
      healthcare: 500,
      entertainment: 200
    }
  },
  {
    id: 'canada',
    name: 'Canada',
    currency: 'CAD',
    exchangeRate: 1.35,
    educationSystem: {
      primaryYears: 6,
      secondaryYears: 6,
      tertiaryOptions: ['Community College', 'University'],
      quality: 88
    },
    jobMarket: {
      unemploymentRate: 5.1,
      averageSalary: 55000,
      popularCareers: ['Healthcare Worker', 'Engineer', 'Teacher'],
      growth: 2.8
    },
    crimeRate: 38.24,
    healthcare: {
      quality: 88,
      cost: 20,
      publicSystem: true
    },
    costOfLiving: {
      housing: 1100,
      food: 380,
      transportation: 280,
      healthcare: 100,
      entertainment: 180
    }
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    currency: 'GBP',
    exchangeRate: 0.82,
    educationSystem: {
      primaryYears: 6,
      secondaryYears: 7,
      tertiaryOptions: ['University', 'Polytechnic', 'Apprenticeship'],
      quality: 87
    },
    jobMarket: {
      unemploymentRate: 3.8,
      averageSalary: 35000,
      popularCareers: ['Finance Professional', 'Healthcare Worker', 'Teacher'],
      growth: 2.1
    },
    crimeRate: 46.15,
    healthcare: {
      quality: 85,
      cost: 0,
      publicSystem: true
    },
    costOfLiving: {
      housing: 1300,
      food: 420,
      transportation: 320,
      healthcare: 0,
      entertainment: 220
    }
  },
  {
    id: 'germany',
    name: 'Germany',
    currency: 'EUR',
    exchangeRate: 0.92,
    educationSystem: {
      primaryYears: 4,
      secondaryYears: 8,
      tertiaryOptions: ['University', 'Technical University', 'Vocational Training'],
      quality: 89
    },
    jobMarket: {
      unemploymentRate: 3.1,
      averageSalary: 48000,
      popularCareers: ['Engineer', 'Manufacturing Worker', 'Healthcare Professional'],
      growth: 2.5
    },
    crimeRate: 34.26,
    healthcare: {
      quality: 92,
      cost: 25,
      publicSystem: true
    },
    costOfLiving: {
      housing: 900,
      food: 350,
      transportation: 250,
      healthcare: 150,
      entertainment: 180
    }
  },
  {
    id: 'japan',
    name: 'Japan',
    currency: 'JPY',
    exchangeRate: 148.5,
    educationSystem: {
      primaryYears: 6,
      secondaryYears: 6,
      tertiaryOptions: ['University', 'Junior College', 'Vocational School'],
      quality: 91
    },
    jobMarket: {
      unemploymentRate: 2.8,
      averageSalary: 42000,
      popularCareers: ['Engineer', 'Office Worker', 'Service Industry'],
      growth: 1.8
    },
    crimeRate: 25.13,
    healthcare: {
      quality: 94,
      cost: 30,
      publicSystem: true
    },
    costOfLiving: {
      housing: 800,
      food: 450,
      transportation: 200,
      healthcare: 120,
      entertainment: 250
    }
  },
  {
    id: 'australia',
    name: 'Australia',
    currency: 'AUD',
    exchangeRate: 1.52,
    educationSystem: {
      primaryYears: 7,
      secondaryYears: 5,
      tertiaryOptions: ['University', 'TAFE', 'Private College'],
      quality: 86
    },
    jobMarket: {
      unemploymentRate: 3.5,
      averageSalary: 58000,
      popularCareers: ['Mining Worker', 'Healthcare Professional', 'Teacher'],
      growth: 3.1
    },
    crimeRate: 41.69,
    healthcare: {
      quality: 89,
      cost: 15,
      publicSystem: true
    },
    costOfLiving: {
      housing: 1400,
      food: 420,
      transportation: 280,
      healthcare: 80,
      entertainment: 200
    }
  },
  {
    id: 'france',
    name: 'France',
    currency: 'EUR',
    exchangeRate: 0.92,
    educationSystem: {
      primaryYears: 5,
      secondaryYears: 7,
      tertiaryOptions: ['University', 'Grande École', 'Technical Institute'],
      quality: 84
    },
    jobMarket: {
      unemploymentRate: 7.2,
      averageSalary: 41000,
      popularCareers: ['Civil Servant', 'Engineer', 'Healthcare Worker'],
      growth: 1.9
    },
    crimeRate: 46.52,
    healthcare: {
      quality: 91,
      cost: 10,
      publicSystem: true
    },
    costOfLiving: {
      housing: 1000,
      food: 380,
      transportation: 300,
      healthcare: 50,
      entertainment: 220
    }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    currency: 'SGD',
    exchangeRate: 1.35,
    educationSystem: {
      primaryYears: 6,
      secondaryYears: 6,
      tertiaryOptions: ['University', 'Polytechnic', 'Institute of Technical Education'],
      quality: 93
    },
    jobMarket: {
      unemploymentRate: 2.1,
      averageSalary: 65000,
      popularCareers: ['Finance Professional', 'Engineer', 'Healthcare Worker'],
      growth: 4.2
    },
    crimeRate: 16.84,
    healthcare: {
      quality: 95,
      cost: 40,
      publicSystem: true
    },
    costOfLiving: {
      housing: 2200,
      food: 500,
      transportation: 150,
      healthcare: 200,
      entertainment: 300
    }
  },
  {
    id: 'sweden',
    name: 'Sweden',
    currency: 'SEK',
    exchangeRate: 10.8,
    educationSystem: {
      primaryYears: 9,
      secondaryYears: 3,
      tertiaryOptions: ['University', 'University College', 'Folk High School'],
      quality: 90
    },
    jobMarket: {
      unemploymentRate: 7.8,
      averageSalary: 45000,
      popularCareers: ['Engineer', 'Healthcare Worker', 'IT Professional'],
      growth: 2.3
    },
    crimeRate: 92.15,
    healthcare: {
      quality: 87,
      cost: 5,
      publicSystem: true
    },
    costOfLiving: {
      housing: 1200,
      food: 400,
      transportation: 250,
      healthcare: 30,
      entertainment: 200
    }
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    currency: 'CHF',
    exchangeRate: 0.91,
    educationSystem: {
      primaryYears: 6,
      secondaryYears: 6,
      tertiaryOptions: ['University', 'University of Applied Sciences', 'Federal VET Diploma'],
      quality: 95
    },
    jobMarket: {
      unemploymentRate: 2.3,
      averageSalary: 85000,
      popularCareers: ['Finance Professional', 'Engineer', 'Pharmaceutical Worker'],
      growth: 2.8
    },
    crimeRate: 22.26,
    healthcare: {
      quality: 96,
      cost: 60,
      publicSystem: false
    },
    costOfLiving: {
      housing: 2000,
      food: 600,
      transportation: 400,
      healthcare: 400,
      entertainment: 300
    }
  }
];