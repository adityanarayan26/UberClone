export const CarList = [
    {
        id: 1,
        name: 'Moto',
        seat: 1,
        image: '/IntercityUberX.png', // UPDATED: Using placeholder
        description: 'Affordable, quick bike rides',
        amount: {
            // UPDATED: Added baseFare and perKm
            'india': { baseFare: 15, perKm: 3, currency: 'INR' }, // e.g., ₹15 base + ₹3/km
            'usa': { baseFare: 2, perKm: 0.5, currency: 'USD' }
        }
    },
    {
        id: 2,
        name: 'Auto',
        seat: 3,
        image: '/IntercityUberX.png', // UPDATED: Using placeholder
        description: 'Get around in an auto-rickshaw',
        amount: {
            // UPDATED: Added baseFare and perKm
            'india': { baseFare: 25, perKm: 8, currency: 'INR' }, // e.g., ₹25 base + ₹8/km
            'usa': { baseFare: 3, perKm: 1, currency: 'USD' } 
        }
    },
    {
        id: 3,
        name: 'Go',
        seat: 4,
        image: '/IntercityUberX.png', // This one seems to be working
        description: 'Affordable, everyday rides',
        amount: {
            // UPDATED: Added baseFare and perKm
            'india': { baseFare: 30, perKm: 10, currency: 'INR' }, // e.g., ₹30 base + ₹10/km
            'usa': { baseFare: 5, perKm: 1.5, currency: 'USD' }
        }
    },
    {
        id: 4,
        name: 'Premier',
        seat: 4,
        image: '/IntercityUberX.png', // UPDATED: Using placeholder
        description: 'Newer cars with more legroom',
        amount: {
            // UPDATED: Added baseFare and perKm
            'india': { baseFare: 40, perKm: 13, currency: 'INR' }, // e.g., ₹40 base + ₹13/km
            'usa': { baseFare: 8, perKm: 1.8, currency: 'USD' }
        }
    },
    {
        id: 5,
        name: 'XL',
        seat: 6,
        image: '/IntercityUberX.png', // UPDATED: Using placeholder
        description: 'Affordable rides for groups',
        amount: {
            // UPDATED: Added baseFare and perKm
            'india': { baseFare: 50, perKm: 18, currency: 'INR' }, // e.g., ₹50 base + ₹18/km
            'usa': { baseFare: 10, perKm: 2.2, currency: 'USD' }
        }
    },
];

