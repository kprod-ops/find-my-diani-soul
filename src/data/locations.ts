export interface Location {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
}

export const locations: Location[] = [
  {
    id: 1,
    name: "Diani Beach",
    description: "Pristine white sands and turquoise waters perfect for sun lovers.",
    image: "diani.jpg",
    tags: ["beach", "relax"]
  },
  {
    id: 2,
    name: "Nomad Café",
    description: "Chill beachside café for sunsets and smoothies.",
    image: "nomad.jpg",
    tags: ["food", "relax"]
  },
  {
    id: 3,
    name: "Kite Beach",
    description: "Thrilling water sports and adrenaline-pumping adventures await.",
    image: "kite.jpg",
    tags: ["adventure", "active"]
  },
  {
    id: 4,
    name: "Leopard Beach Resort",
    description: "Luxurious poolside relaxation in a tropical paradise.",
    image: "leopard.jpg",
    tags: ["luxury", "relax"]
  },
  {
    id: 5,
    name: "Ukunda Market",
    description: "Colorful local market buzzing with authentic Kenyan culture.",
    image: "ukunda.jpg",
    tags: ["culture", "explore"]
  },
  {
    id: 6,
    name: "Sunset Point",
    description: "Romantic golden hour views that paint the sky with magic.",
    image: "location-sunset.jpg",
    tags: ["romance", "relax"]
  },
  {
    id: 7,
    name: "Colobus Trail",
    description: "Peaceful jungle walk through lush tropical nature.",
    image: "colobus.jpg",
    tags: ["nature", "explore"]
  },
  {
    id: 8,
    name: "Tiwi Beach",
    description: "Secluded paradise for quiet moments and contemplation.",
    image: "tiwi.jpg",
    tags: ["beach", "relax"]
  },
  {
    id: 9,
    name: "Ali Barbour's Cave",
    description: "Unique dining experience in a natural coral cave.",
    image: "ali.jpg",
    tags: ["food", "unique"]
  },
  {
    id: 10,
    name: "Shimba Hills",
    description: "Wildlife encounters and stunning hilltop vistas.",
    image: "shimba.png",
    tags: ["nature", "adventure"]
  },
  {
    id: 11,
    name: "Forty Thieves Beach Bar",
    description: "Vibrant beach parties and cocktails with a view.",
    image: "thieves.jpg",
    tags: ["food", "social"]
  },
  {
    id: 12,
    name: "Diving Center",
    description: "Explore underwater coral reefs and marine life.",
    image: "scuba.jpeg",
    tags: ["adventure", "active"]
  },
  {
    id: 13,
    name: "Mwaluganje Sanctuary",
    description: "Elephant watching in protected natural habitat.",
    image: "elephant.jpg",
    tags: ["nature", "culture"]
  },
  {
    id: 14,
    name: "Coral Cove",
    description: "Snorkeling haven with crystal clear shallow waters.",
    image: "location-beach.jpg",
    tags: ["beach", "adventure"]
  },
  {
    id: 15,
    name: "Galu Beach",
    description: "Serene stretch perfect for long romantic walks.",
    image: "galu.jpg",
    tags: ["romance", "beach"]
  }
];

export const profiles = {
  "beach": {
    name: "Beach Explorer",
    emoji: "🏖️",
    description: "You're drawn to sun, sand, and surf. Paradise found where the ocean meets the shore!"
  },
  "relax": {
    name: "Chill Nomad",
    emoji: "🧘",
    description: "Life's a beach, and you're here for the vibes. Slow mornings and sunset moments are your thing."
  },
  "adventure": {
    name: "Adventure Junkie",
    emoji: "🧗",
    description: "Thrills and spills fuel your soul! From diving to kiting, adrenaline is your calling."
  },
  "food": {
    name: "Foodie Explorer",
    emoji: "🍹",
    description: "Every meal is an adventure. From cave restaurants to beach bars, you follow your taste buds."
  },
  "culture": {
    name: "Culture Seeker",
    emoji: "🎭",
    description: "Markets, people, traditions—you crave authentic local experiences and stories."
  },
  "romance": {
    name: "Romantic Dreamer",
    emoji: "💞",
    description: "Sunsets, moonlit walks, and magical moments define your perfect getaway."
  },
  "nature": {
    name: "Nature Wanderer",
    emoji: "🌿",
    description: "Trails, wildlife, and green spaces speak to your adventurous spirit."
  },
  "unique": {
    name: "Unique Explorer",
    emoji: "✨",
    description: "You seek experiences off the beaten path—the more unusual, the better!"
  }
};

// Shuffle array to get random pairs
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get profile type from liked locations
export function calculateProfile(likedLocationIds: number[]): string {
  const tagCounts: Record<string, number> = {};
  
  likedLocationIds.forEach(id => {
    const location = locations.find(loc => loc.id === id);
    if (location) {
      location.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Find most common tag
  let maxCount = 0;
  let profileType = "relax"; // default
  
  Object.entries(tagCounts).forEach(([tag, count]) => {
    if (count > maxCount) {
      maxCount = count;
      profileType = tag;
    }
  });

  return profileType;
}

// Calculate match percentage between two users
export function calculateMatch(userLikes: number[], friendLikes: number[]): number {
  const sharedLikes = userLikes.filter(id => friendLikes.includes(id));
  const totalUniqueLikes = new Set([...userLikes, ...friendLikes]).size;
  
  if (totalUniqueLikes === 0) return 0;
  
  return Math.round((sharedLikes.length / totalUniqueLikes) * 100);
}
