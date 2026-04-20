import { User, ChatConversation } from '../types';
import { pushService } from './PushService';
import { billingService } from './BillingService';
import { CONFIG } from '../config';
import { FirebaseFunctionsStubs } from './FirebaseFunctionsStubs';

export const INITIAL_CURRENT_USER: User = {
  "uid": "current-user-123",
  "name": "Jordan",
  "age": 28,
  "members": [
    {
      "name": "Jordan",
      "age": 28,
      "genderIdentity": "Woman",
      "heritage": [
        "Black / African",
        "Western European"
      ],
      "dynamics": [
        "Switch"
      ],
      "interests": [
        "Art & Design",
        "Food & Dining"
      ]
    }
  ],
  "bio": "Designer & Architect. Love brutalism and spicy food.",
  "isVerified": true,
  "heritage": [
    "Black / African",
    "Western European"
  ],
  "orientations": [
    "Queer",
    "Bisexual"
  ],
  "datingStyles": [
    "Monogamish",
    "ENM / Open"
  ],
  "goals": [
    "Dating",
    "Intimacy"
  ],
  "photos": [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
  ],
  "entitlements": { "plan": "FREE", "imCredits": 0, "ghostMode": false, "privatePhotos": false },
  "visibilityMode": "PUBLIC",
  "onboardingComplete": true
};

export const INITIAL_LIKES_YOU: User[] = [
  {
    "uid": "user-41",
    "name": "Riley",
    "age": 33,
    "members": [
      {
        "name": "Riley",
        "age": 33,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian",
          "Latin American"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Gaming & Tech",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Hey",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "Latin American"
    ],
    "orientations": [
      "Asexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 15,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-14",
    "name": "Reese",
    "age": 37,
    "members": [
      {
        "name": "Reese",
        "age": 37,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African",
          "North African"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Nightlife & Parties",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Looking for a plus one for concerts and events.",
    "isVerified": true,
    "heritage": [
      "Black / African",
      "North African"
    ],
    "orientations": [
      "Heterosexual",
      "Homoflexible"
    ],
    "datingStyles": [
      "ENM / Open"
    ],
    "goals": [
      "Mentorship",
      "Networking"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 8,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-61",
    "name": "Charlie & Penelope",
    "age": 32,
    "members": [
      {
        "name": "Charlie",
        "age": 35,
        "genderIdentity": "Man",
        "heritage": [
          "Afro‑Latin"
        ],
        "dynamics": [
          "Egalitarian",
          "Progressive"
        ],
        "interests": [
          "Nightlife & Parties",
          "Music & Concerts",
          "Reading & Writing",
          "Fitness & Wellness"
        ]
      },
      {
        "name": "Penelope",
        "age": 29,
        "genderIdentity": "Woman",
        "heritage": [
          "Prefer not to say",
          "Southeast Asian"
        ],
        "dynamics": [
          "Progressive",
          "Dominant"
        ],
        "interests": [
          "Gaming & Tech",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Looking for a plus one for concerts and events.",
    "isVerified": false,
    "heritage": [
      "Afro‑Latin",
      "Prefer not to say",
      "Southeast Asian"
    ],
    "orientations": [
      "Pansexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 12,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-34",
    "name": "Hayden",
    "age": 30,
    "members": [
      {
        "name": "Hayden",
        "age": 30,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Prefer not to say"
        ],
        "dynamics": [
          "Traditional",
          "Progressive"
        ],
        "interests": [
          "Music & Concerts",
          "Food & Dining",
          "Nightlife & Parties",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "Looking for someone to explore the city with.",
    "isVerified": false,
    "heritage": [
      "Prefer not to say"
    ],
    "orientations": [
      "Heterosexual",
      "Heteroflexible"
    ],
    "datingStyles": [
      "ENM / Open",
      "Open Relationship"
    ],
    "goals": [
      "Friends",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 6,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REQUESTED"
      }
    }
  },
  {
    "uid": "user-56",
    "name": "Phoenix & Harper",
    "age": 36,
    "members": [
      {
        "name": "Phoenix",
        "age": 42,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Submissive"
        ],
        "interests": [
          "Reading & Writing",
          "Music & Concerts"
        ]
      },
      {
        "name": "Harper",
        "age": 29,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Art & Design",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Always down for an adventure.",
    "isVerified": false,
    "heritage": [
      "East Asian",
      "South Asian"
    ],
    "orientations": [
      "Heterosexual",
      "Lesbian"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Travel Buddy",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "GHOST",
    "visibleToIds": [
      "current-user-123"
    ],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REQUESTED"
      }
    }
  },
  {
    "uid": "user-44",
    "name": "Amelia",
    "age": 29,
    "members": [
      {
        "name": "Amelia",
        "age": 29,
        "genderIdentity": "Woman",
        "heritage": [
          "North African",
          "Black / African"
        ],
        "dynamics": [
          "Dominant",
          "Switch"
        ],
        "interests": [
          "Reading & Writing",
          "Gaming & Tech",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Hey",
    "isVerified": false,
    "heritage": [
      "North African",
      "Black / African"
    ],
    "orientations": [
      "Homosexual",
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamish"
    ],
    "goals": [
      "Mentorship",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-5",
    "name": "Hayden",
    "age": 35,
    "members": [
      {
        "name": "Hayden",
        "age": 35,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Reading & Writing",
          "Travel & Outdoors",
          "Art & Design"
        ]
      }
    ],
    "bio": "Just looking to see what's out there.",
    "isVerified": true,
    "heritage": [
      "East Asian"
    ],
    "orientations": [
      "Gay",
      "Queer"
    ],
    "datingStyles": [
      "ENM / Open",
      "Monogamish"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 5,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-72",
    "name": "Justice & Zion & Victoria",
    "age": 37,
    "members": [
      {
        "name": "Justice",
        "age": 37,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Prefer not to say",
          "Western European"
        ],
        "dynamics": [
          "Traditional",
          "Egalitarian"
        ],
        "interests": [
          "Reading & Writing",
          "Art & Design",
          "Nightlife & Parties"
        ]
      },
      {
        "name": "Zion",
        "age": 38,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Latin American",
          "South Asian"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Gaming & Tech",
          "Nightlife & Parties",
          "Travel & Outdoors"
        ]
      },
      {
        "name": "Victoria",
        "age": 37,
        "genderIdentity": "Woman",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining"
        ]
      }
    ],
    "bio": "New here, taking it slow",
    "isVerified": true,
    "heritage": [
      "Prefer not to say",
      "Western European",
      "Latin American",
      "South Asian",
      "Eastern European"
    ],
    "orientations": [
      "Queer",
      "Pansexual"
    ],
    "datingStyles": [
      "ENM / Open",
      "Open Relationship"
    ],
    "goals": [
      "Friends",
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 18,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-66",
    "name": "Casey & Layla",
    "age": 38,
    "members": [
      {
        "name": "Casey",
        "age": 47,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "North African"
        ],
        "dynamics": [
          "Submissive"
        ],
        "interests": [
          "Food & Dining",
          "Reading & Writing"
        ]
      },
      {
        "name": "Layla",
        "age": 29,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African",
          "South Asian"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Reading & Writing",
          "Food & Dining",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Ask me",
    "isVerified": false,
    "heritage": [
      "North African",
      "Black / African",
      "South Asian"
    ],
    "orientations": [
      "Heterosexual",
      "Homoflexible"
    ],
    "datingStyles": [
      "ENM / Open",
      "Open Relationship"
    ],
    "goals": [
      "Dating"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-12",
    "name": "Hayden",
    "age": 37,
    "members": [
      {
        "name": "Hayden",
        "age": 37,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Black / Caribbean"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Food & Dining",
          "Travel & Outdoors",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Let's grab tacos and margaritas.",
    "isVerified": true,
    "heritage": [
      "Black / Caribbean"
    ],
    "orientations": [
      "Heterosexual",
      "Pansexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Mentorship",
      "Networking"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  }
];
export const INITIAL_DEMO_MATCHES: User[] = [
  {
    "uid": "user-17",
    "name": "Mila",
    "age": 46,
    "members": [
      {
        "name": "Mila",
        "age": 46,
        "genderIdentity": "Woman",
        "heritage": [
          "Western European"
        ],
        "dynamics": [
          "Progressive",
          "Egalitarian"
        ],
        "interests": [
          "Reading & Writing",
          "Food & Dining",
          "Nightlife & Parties",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Sapiosexual. Let's talk about the universe.",
    "isVerified": false,
    "heritage": [
      "Western European"
    ],
    "orientations": [
      "Heterosexual"
    ],
    "datingStyles": [
      "Open Relationship",
      "Monogamous"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 5,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-57",
    "name": "Cameron & Chloe",
    "age": 25,
    "members": [
      {
        "name": "Cameron",
        "age": 23,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "South Asian",
          "East Asian"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Travel & Outdoors",
          "Art & Design"
        ]
      },
      {
        "name": "Chloe",
        "age": 27,
        "genderIdentity": "Woman",
        "heritage": [
          "North African"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Looking for a genuine connection.",
    "isVerified": true,
    "heritage": [
      "South Asian",
      "East Asian",
      "North African"
    ],
    "orientations": [
      "Heterosexual",
      "Lesbian"
    ],
    "datingStyles": [
      "Non-Monogamous"
    ],
    "goals": [
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 40,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-4",
    "name": "Sage",
    "age": 36,
    "members": [
      {
        "name": "Sage",
        "age": 36,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Middle Eastern",
          "Prefer not to say"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Nightlife & Parties",
          "Reading & Writing",
          "Food & Dining",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Open to meeting couples",
    "isVerified": true,
    "heritage": [
      "Middle Eastern",
      "Prefer not to say"
    ],
    "orientations": [
      "Heteroflexible",
      "Heterosexual"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Travel Buddy",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 36,
    "visibilityMode": "GHOST",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REQUESTED"
      }
    }
  },
  {
    "uid": "user-70",
    "name": "Eleanor & Scarlett",
    "age": 37,
    "members": [
      {
        "name": "Eleanor",
        "age": 27,
        "genderIdentity": "Woman",
        "heritage": [
          "Prefer not to say"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Travel & Outdoors",
          "Food & Dining",
          "Music & Concerts"
        ]
      },
      {
        "name": "Scarlett",
        "age": 46,
        "genderIdentity": "Woman",
        "heritage": [
          "Middle Eastern",
          "East Asian"
        ],
        "dynamics": [
          "Progressive",
          "Egalitarian"
        ],
        "interests": [
          "Gaming & Tech",
          "Reading & Writing",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "idk what to put here lol",
    "isVerified": false,
    "heritage": [
      "Prefer not to say",
      "Middle Eastern",
      "East Asian"
    ],
    "orientations": [
      "Queer"
    ],
    "datingStyles": [
      "Polyamorous",
      "ENM / Open"
    ],
    "goals": [
      "Networking"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 17,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-11",
    "name": "Morgan",
    "age": 24,
    "members": [
      {
        "name": "Morgan",
        "age": 24,
        "genderIdentity": "Man",
        "heritage": [
          "Middle Eastern",
          "Prefer not to say"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Travel & Outdoors",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Not great at bios, ask me anything",
    "isVerified": false,
    "heritage": [
      "Middle Eastern",
      "Prefer not to say"
    ],
    "orientations": [
      "Bisexual",
      "Queer"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REQUESTED"
      }
    }
  },
  {
    "uid": "user-68",
    "name": "Tatum & Alex",
    "age": 39,
    "members": [
      {
        "name": "Tatum",
        "age": 52,
        "genderIdentity": "Man",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Fitness & Wellness",
          "Travel & Outdoors",
          "Food & Dining"
        ]
      },
      {
        "name": "Alex",
        "age": 26,
        "genderIdentity": "Man",
        "heritage": [
          "Latin American"
        ],
        "dynamics": [
          "Traditional",
          "Switch"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Ask me",
    "isVerified": false,
    "heritage": [
      "Eastern European",
      "Latin American"
    ],
    "orientations": [
      "Demisexual",
      "Queer"
    ],
    "datingStyles": [
      "Exploring",
      "Monogamous"
    ],
    "goals": [
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 1,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "APPROVED"
      }
    }
  },
  {
    "uid": "user-71",
    "name": "Finley & Skyler & Sutton",
    "age": 34,
    "members": [
      {
        "name": "Finley",
        "age": 30,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "North African",
          "Prefer not to say"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Fitness & Wellness",
          "Art & Design"
        ]
      },
      {
        "name": "Skyler",
        "age": 36,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "East Asian",
          "Black / African"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Reading & Writing",
          "Food & Dining",
          "Art & Design",
          "Travel & Outdoors"
        ]
      },
      {
        "name": "Sutton",
        "age": 36,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Traditional",
          "Progressive"
        ],
        "interests": [
          "Food & Dining",
          "Travel & Outdoors",
          "Reading & Writing",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Love hiking, coffee, and good conversations.",
    "isVerified": false,
    "heritage": [
      "North African",
      "Prefer not to say",
      "East Asian",
      "Black / African"
    ],
    "orientations": [
      "Queer"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 5,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-31",
    "name": "Aurora",
    "age": 31,
    "members": [
      {
        "name": "Aurora",
        "age": 31,
        "genderIdentity": "Woman",
        "heritage": [
          "Latin American"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Food & Dining",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Ethically non-monogamous. Communication is key.",
    "isVerified": false,
    "heritage": [
      "Latin American"
    ],
    "orientations": [
      "Heterosexual",
      "Pansexual"
    ],
    "datingStyles": [
      "Open Relationship",
      "Monogamous"
    ],
    "goals": [
      "Friends",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 15,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  }
];
export const INITIAL_PASSED: User[] = [
  {
    "uid": "user-59",
    "name": "Madison & Nora",
    "age": 35,
    "members": [
      {
        "name": "Madison",
        "age": 46,
        "genderIdentity": "Woman",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Fitness & Wellness",
          "Food & Dining",
          "Travel & Outdoors"
        ]
      },
      {
        "name": "Nora",
        "age": 23,
        "genderIdentity": "Woman",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "Looking for a genuine connection.",
    "isVerified": true,
    "heritage": [
      "Eastern European"
    ],
    "orientations": [
      "Queer",
      "Heterosexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 13,
    "visibilityMode": "GHOST",
    "visibleToIds": [
      "current-user-123"
    ]
  },
  {
    "uid": "user-53",
    "name": "Elizabeth & Evelyn",
    "age": 26,
    "members": [
      {
        "name": "Elizabeth",
        "age": 26,
        "genderIdentity": "Woman",
        "heritage": [
          "Southeast Asian",
          "Latin American"
        ],
        "dynamics": [
          "Egalitarian",
          "Dominant"
        ],
        "interests": [
          "Gaming & Tech",
          "Art & Design",
          "Nightlife & Parties"
        ]
      },
      {
        "name": "Evelyn",
        "age": 25,
        "genderIdentity": "Woman",
        "heritage": [
          "Western European",
          "Afro‑Latin"
        ],
        "dynamics": [
          "Progressive",
          "Dominant"
        ],
        "interests": [
          "Reading & Writing",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Just looking to see what's out there.",
    "isVerified": false,
    "heritage": [
      "Southeast Asian",
      "Latin American",
      "Western European",
      "Afro‑Latin"
    ],
    "orientations": [
      "Homoflexible",
      "Heterosexual"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Friends",
      "Casual"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 1,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-24",
    "name": "Shiloh",
    "age": 42,
    "members": [
      {
        "name": "Shiloh",
        "age": 42,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African",
          "Prefer not to say"
        ],
        "dynamics": [
          "Dominant",
          "Switch"
        ],
        "interests": [
          "Art & Design",
          "Nightlife & Parties",
          "Food & Dining",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Looking for a genuine connection.",
    "isVerified": false,
    "heritage": [
      "Black / African",
      "Prefer not to say"
    ],
    "orientations": [
      "Heterosexual",
      "Asexual"
    ],
    "datingStyles": [
      "Non-Monogamous",
      "Open Relationship"
    ],
    "goals": [
      "Friends",
      "Casual"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-32",
    "name": "Tatum",
    "age": 37,
    "members": [
      {
        "name": "Tatum",
        "age": 37,
        "genderIdentity": "Man",
        "heritage": [
          "Prefer not to say",
          "Afro‑Latin"
        ],
        "dynamics": [
          "Submissive",
          "Switch"
        ],
        "interests": [
          "Fitness & Wellness",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Open to meeting couples",
    "isVerified": false,
    "heritage": [
      "Prefer not to say",
      "Afro‑Latin"
    ],
    "orientations": [
      "Demisexual",
      "Heterosexual"
    ],
    "datingStyles": [
      "Open Relationship",
      "ENM / Open"
    ],
    "goals": [
      "Life Partner",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 16,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REQUESTED"
      }
    }
  },
  {
    "uid": "user-51",
    "name": "Nora & Aubrey",
    "age": 34,
    "members": [
      {
        "name": "Nora",
        "age": 46,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / Caribbean",
          "North African"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Reading & Writing",
          "Music & Concerts",
          "Fitness & Wellness"
        ]
      },
      {
        "name": "Aubrey",
        "age": 21,
        "genderIdentity": "Woman",
        "heritage": [
          "Western European",
          "Prefer not to say"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Nightlife & Parties",
          "Reading & Writing",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Looking for a connection that feels easy.",
    "isVerified": false,
    "heritage": [
      "Black / Caribbean",
      "North African",
      "Western European",
      "Prefer not to say"
    ],
    "orientations": [
      "Heterosexual",
      "Queer"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Life Partner",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 14,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-45",
    "name": "Micah",
    "age": 37,
    "members": [
      {
        "name": "Micah",
        "age": 37,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Prefer not to say"
        ],
        "dynamics": [
          "Progressive",
          "Switch"
        ],
        "interests": [
          "Music & Concerts",
          "Nightlife & Parties",
          "Art & Design",
          "Food & Dining"
        ]
      }
    ],
    "bio": "New here",
    "isVerified": false,
    "heritage": [
      "Prefer not to say"
    ],
    "orientations": [
      "Homosexual"
    ],
    "datingStyles": [
      "Polyamorous",
      "Non-Monogamous"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-27",
    "name": "Jamie",
    "age": 37,
    "members": [
      {
        "name": "Jamie",
        "age": 37,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "South Asian",
          "Prefer not to say"
        ],
        "dynamics": [
          "Switch",
          "Progressive"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Not great at bios, ask me anything",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "Prefer not to say"
    ],
    "orientations": [
      "Asexual"
    ],
    "datingStyles": [
      "Polyamorous",
      "Exploring"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 22,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  }
];
export const INITIAL_CANDIDATES: User[] = [
  {
    "uid": "user-49",
    "name": "Sutton & Aria",
    "age": 24,
    "members": [
      {
        "name": "Sutton",
        "age": 21,
        "genderIdentity": "Man",
        "heritage": [
          "North African"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Nightlife & Parties",
          "Food & Dining",
          "Fitness & Wellness"
        ]
      },
      {
        "name": "Aria",
        "age": 27,
        "genderIdentity": "Woman",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Reading & Writing",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "Let's see where this goes.",
    "isVerified": true,
    "heritage": [
      "North African",
      "East Asian"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Dating",
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 12,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REQUESTED"
      }
    }
  },
  {
    "uid": "user-52",
    "name": "Ellie & Lily",
    "age": 35,
    "members": [
      {
        "name": "Ellie",
        "age": 39,
        "genderIdentity": "Woman",
        "heritage": [
          "Western European",
          "South Asian"
        ],
        "dynamics": [
          "Submissive",
          "Switch"
        ],
        "interests": [
          "Nightlife & Parties",
          "Travel & Outdoors",
          "Art & Design"
        ]
      },
      {
        "name": "Lily",
        "age": 30,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African",
          "South Asian"
        ],
        "dynamics": [
          "Submissive",
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining"
        ]
      }
    ],
    "bio": "New here, taking it slow",
    "isVerified": true,
    "heritage": [
      "Western European",
      "South Asian",
      "Black / African"
    ],
    "orientations": [
      "Queer",
      "Asexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Friends",
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 15,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-69",
    "name": "Hunter & Madison",
    "age": 31,
    "members": [
      {
        "name": "Hunter",
        "age": 35,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian",
          "East Asian"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Music & Concerts",
          "Nightlife & Parties"
        ]
      },
      {
        "name": "Madison",
        "age": 27,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African",
          "Black / Caribbean"
        ],
        "dynamics": [
          "Egalitarian",
          "Switch"
        ],
        "interests": [
          "Fitness & Wellness",
          "Food & Dining"
        ]
      }
    ],
    "bio": "idk what to put here lol",
    "isVerified": false,
    "heritage": [
      "Southeast Asian",
      "East Asian",
      "Black / African",
      "Black / Caribbean"
    ],
    "orientations": [
      "Pansexual",
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 13,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-79",
    "name": "Logan & Rory & Lillian",
    "age": 30,
    "members": [
      {
        "name": "Logan",
        "age": 33,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African"
        ],
        "dynamics": [
          "Traditional",
          "Switch"
        ],
        "interests": [
          "Music & Concerts",
          "Travel & Outdoors",
          "Reading & Writing"
        ]
      },
      {
        "name": "Rory",
        "age": 26,
        "genderIdentity": "Man",
        "heritage": [
          "Western European"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Fitness & Wellness",
          "Music & Concerts"
        ]
      },
      {
        "name": "Lillian",
        "age": 30,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African",
          "Black / Caribbean"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Food & Dining",
          "Art & Design",
          "Reading & Writing",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Hey",
    "isVerified": false,
    "heritage": [
      "Black / African",
      "Western European",
      "Black / Caribbean"
    ],
    "orientations": [
      "Homoflexible",
      "Pansexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-6",
    "name": "Parker",
    "age": 38,
    "members": [
      {
        "name": "Parker",
        "age": 38,
        "genderIdentity": "Man",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Dominant",
          "Traditional"
        ],
        "interests": [
          "Nightlife & Parties",
          "Art & Design"
        ]
      }
    ],
    "bio": "Looking for someone to binge-watch shows with.",
    "isVerified": true,
    "heritage": [
      "Eastern European"
    ],
    "orientations": [
      "Gay",
      "Asexual"
    ],
    "datingStyles": [
      "Exploring",
      "Polyamorous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512484776495-a09a92413a4a?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-74",
    "name": "Emma & Taylor & Blake & Leah",
    "age": 24,
    "members": [
      {
        "name": "Emma",
        "age": 25,
        "genderIdentity": "Woman",
        "heritage": [
          "North African",
          "Prefer not to say"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Fitness & Wellness",
          "Reading & Writing"
        ]
      },
      {
        "name": "Taylor",
        "age": 27,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "South Asian",
          "Prefer not to say"
        ],
        "dynamics": [
          "Egalitarian",
          "Traditional"
        ],
        "interests": [
          "Reading & Writing",
          "Fitness & Wellness",
          "Food & Dining",
          "Art & Design"
        ]
      },
      {
        "name": "Blake",
        "age": 21,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Progressive",
          "Egalitarian"
        ],
        "interests": [
          "Food & Dining",
          "Reading & Writing",
          "Gaming & Tech",
          "Art & Design"
        ]
      },
      {
        "name": "Leah",
        "age": 23,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African",
          "Southeast Asian"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Gaming & Tech",
          "Music & Concerts",
          "Art & Design",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Looking for a genuine connection.",
    "isVerified": false,
    "heritage": [
      "North African",
      "Prefer not to say",
      "South Asian",
      "East Asian",
      "Black / African",
      "Southeast Asian"
    ],
    "orientations": [
      "Asexual",
      "Heteroflexible"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Dating",
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 11,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-76",
    "name": "Ashton & Emma & Lillian & Sutton",
    "age": 31,
    "members": [
      {
        "name": "Ashton",
        "age": 25,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Reading & Writing",
          "Art & Design",
          "Food & Dining"
        ]
      },
      {
        "name": "Emma",
        "age": 40,
        "genderIdentity": "Woman",
        "heritage": [
          "Latin American"
        ],
        "dynamics": [
          "Submissive"
        ],
        "interests": [
          "Gaming & Tech",
          "Nightlife & Parties",
          "Travel & Outdoors"
        ]
      },
      {
        "name": "Lillian",
        "age": 35,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Egalitarian",
          "Submissive"
        ],
        "interests": [
          "Travel & Outdoors",
          "Art & Design"
        ]
      },
      {
        "name": "Sutton",
        "age": 24,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Music & Concerts",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Looking for a third to join us for drinks.",
    "isVerified": false,
    "heritage": [
      "Black / African",
      "Latin American",
      "South Asian",
      "East Asian"
    ],
    "orientations": [
      "Homosexual",
      "Queer"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Friends",
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 4,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-64",
    "name": "Ellie & Stella",
    "age": 31,
    "members": [
      {
        "name": "Ellie",
        "age": 25,
        "genderIdentity": "Woman",
        "heritage": [
          "East Asian",
          "Eastern European"
        ],
        "dynamics": [
          "Progressive",
          "Submissive"
        ],
        "interests": [
          "Art & Design",
          "Fitness & Wellness",
          "Reading & Writing",
          "Food & Dining"
        ]
      },
      {
        "name": "Stella",
        "age": 36,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African"
        ],
        "dynamics": [
          "Switch",
          "Submissive"
        ],
        "interests": [
          "Nightlife & Parties",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Swipe right if you like bad puns.",
    "isVerified": false,
    "heritage": [
      "East Asian",
      "Eastern European",
      "Black / African"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Monogamish"
    ],
    "goals": [
      "Networking",
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 1,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-78",
    "name": "Elizabeth & Riley & Emma",
    "age": 31,
    "members": [
      {
        "name": "Elizabeth",
        "age": 33,
        "genderIdentity": "Woman",
        "heritage": [
          "East Asian"
        ],
        "dynamics": [
          "Switch",
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Gaming & Tech"
        ]
      },
      {
        "name": "Riley",
        "age": 27,
        "genderIdentity": "Woman",
        "heritage": [
          "North African",
          "Afro‑Latin"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Art & Design",
          "Gaming & Tech"
        ]
      },
      {
        "name": "Emma",
        "age": 33,
        "genderIdentity": "Woman",
        "heritage": [
          "Afro‑Latin",
          "Prefer not to say"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Gaming & Tech",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Always up for trying something new.",
    "isVerified": false,
    "heritage": [
      "East Asian",
      "North African",
      "Afro‑Latin",
      "Prefer not to say"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Non-Monogamous",
      "Monogamish"
    ],
    "goals": [
      "Dating",
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "APPROVED"
      }
    }
  },
  {
    "uid": "user-29",
    "name": "Layla",
    "age": 26,
    "members": [
      {
        "name": "Layla",
        "age": 26,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian",
          "Black / African"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Reading & Writing",
          "Travel & Outdoors",
          "Art & Design"
        ]
      }
    ],
    "bio": "Swipe right if you like bad puns.",
    "isVerified": true,
    "heritage": [
      "South Asian",
      "Black / African"
    ],
    "orientations": [
      "Heterosexual",
      "Homosexual"
    ],
    "datingStyles": [
      "ENM / Open",
      "Polyamorous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "GHOST",
    "visibleToIds": []
  },
  {
    "uid": "user-54",
    "name": "Blake & Leah",
    "age": 28,
    "members": [
      {
        "name": "Blake",
        "age": 31,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Southeast Asian",
          "Afro‑Latin"
        ],
        "dynamics": [
          "Submissive",
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Reading & Writing",
          "Music & Concerts"
        ]
      },
      {
        "name": "Leah",
        "age": 24,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / Caribbean",
          "South Asian"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Fitness & Wellness",
          "Food & Dining",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Love hiking, coffee, and good conversations.",
    "isVerified": false,
    "heritage": [
      "Southeast Asian",
      "Afro‑Latin",
      "Black / Caribbean",
      "South Asian"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Open Relationship",
      "Monogamous"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 2,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-28",
    "name": "Casey",
    "age": 22,
    "members": [
      {
        "name": "Casey",
        "age": 22,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Submissive"
        ],
        "interests": [
          "Music & Concerts",
          "Travel & Outdoors",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Looking for someone to explore the city with.",
    "isVerified": true,
    "heritage": [
      "Eastern European"
    ],
    "orientations": [
      "Queer",
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Life Partner",
      "Networking"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 8,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-15",
    "name": "Zoe",
    "age": 39,
    "members": [
      {
        "name": "Zoe",
        "age": 39,
        "genderIdentity": "Woman",
        "heritage": [
          "Eastern European"
        ],
        "dynamics": [
          "Dominant",
          "Traditional"
        ],
        "interests": [
          "Travel & Outdoors",
          "Art & Design",
          "Gaming & Tech",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Love hiking, coffee, and good conversations.",
    "isVerified": false,
    "heritage": [
      "Eastern European"
    ],
    "orientations": [
      "Homoflexible",
      "Queer"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-50",
    "name": "Frankie & Dallas",
    "age": 31,
    "members": [
      {
        "name": "Frankie",
        "age": 29,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Progressive",
          "Submissive"
        ],
        "interests": [
          "Food & Dining",
          "Nightlife & Parties",
          "Gaming & Tech",
          "Fitness & Wellness"
        ]
      },
      {
        "name": "Dallas",
        "age": 33,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian",
          "East Asian"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Music & Concerts",
          "Gaming & Tech",
          "Reading & Writing",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Always down for an adventure.",
    "isVerified": true,
    "heritage": [
      "South Asian",
      "Southeast Asian",
      "East Asian"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Casual"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 2,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-36",
    "name": "Madison",
    "age": 31,
    "members": [
      {
        "name": "Madison",
        "age": 31,
        "genderIdentity": "Woman",
        "heritage": [
          "Western European"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Reading & Writing",
          "Nightlife & Parties",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "Looking for a plus one for concerts and events.",
    "isVerified": false,
    "heritage": [
      "Western European"
    ],
    "orientations": [
      "Asexual",
      "Demisexual"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Travel Buddy",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "APPROVED"
      }
    }
  },
  {
    "uid": "user-80",
    "name": "Finley & Sawyer & Harley",
    "age": 28,
    "members": [
      {
        "name": "Finley",
        "age": 30,
        "genderIdentity": "Man",
        "heritage": [
          "Western European",
          "Black / Caribbean"
        ],
        "dynamics": [
          "Dominant",
          "Egalitarian"
        ],
        "interests": [
          "Reading & Writing",
          "Art & Design",
          "Travel & Outdoors",
          "Food & Dining"
        ]
      },
      {
        "name": "Sawyer",
        "age": 24,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "South Asian",
          "North African"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Reading & Writing"
        ]
      },
      {
        "name": "Harley",
        "age": 29,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Switch",
          "Submissive"
        ],
        "interests": [
          "Nightlife & Parties",
          "Art & Design"
        ]
      }
    ],
    "bio": "Hey",
    "isVerified": false,
    "heritage": [
      "Western European",
      "Black / Caribbean",
      "South Asian",
      "North African",
      "Southeast Asian"
    ],
    "orientations": [
      "Gay"
    ],
    "datingStyles": [
      "Monogamish",
      "Non-Monogamous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 4,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REVOKED"
      }
    }
  },
  {
    "uid": "user-60",
    "name": "Micah & Micah",
    "age": 43,
    "members": [
      {
        "name": "Micah",
        "age": 52,
        "genderIdentity": "Man",
        "heritage": [
          "Latin American",
          "South Asian"
        ],
        "dynamics": [
          "Progressive",
          "Switch"
        ],
        "interests": [
          "Art & Design",
          "Reading & Writing"
        ]
      },
      {
        "name": "Micah",
        "age": 33,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African",
          "South Asian"
        ],
        "dynamics": [
          "Dominant",
          "Progressive"
        ],
        "interests": [
          "Food & Dining",
          "Art & Design"
        ]
      }
    ],
    "bio": "Looking for someone to share laughs with.",
    "isVerified": true,
    "heritage": [
      "Latin American",
      "South Asian",
      "Black / African"
    ],
    "orientations": [
      "Demisexual",
      "Heterosexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Dating"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 5,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-33",
    "name": "Ava",
    "age": 44,
    "members": [
      {
        "name": "Ava",
        "age": 44,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian",
          "Prefer not to say"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Nightlife & Parties",
          "Art & Design",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Looking for a plus one for concerts and events.",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "Prefer not to say"
    ],
    "orientations": [
      "Homoflexible",
      "Pansexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Networking",
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-62",
    "name": "Peyton & Micah",
    "age": 27,
    "members": [
      {
        "name": "Peyton",
        "age": 32,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian",
          "East Asian"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Art & Design",
          "Nightlife & Parties"
        ]
      },
      {
        "name": "Micah",
        "age": 22,
        "genderIdentity": "Man",
        "heritage": [
          "Black / Caribbean"
        ],
        "dynamics": [
          "Submissive",
          "Dominant"
        ],
        "interests": [
          "Food & Dining",
          "Fitness & Wellness",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Ethically non-monogamous. Communication is key.",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "East Asian",
      "Black / Caribbean"
    ],
    "orientations": [
      "Homoflexible",
      "Heterosexual"
    ],
    "datingStyles": [
      "Non-Monogamous"
    ],
    "goals": [
      "Life Partner",
      "Dating"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 20,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-63",
    "name": "Justice & Evelyn",
    "age": 50,
    "members": [
      {
        "name": "Justice",
        "age": 49,
        "genderIdentity": "Man",
        "heritage": [
          "Afro‑Latin",
          "South Asian"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Music & Concerts"
        ]
      },
      {
        "name": "Evelyn",
        "age": 51,
        "genderIdentity": "Woman",
        "heritage": [
          "Middle Eastern",
          "Afro‑Latin"
        ],
        "dynamics": [
          "Dominant",
          "Progressive"
        ],
        "interests": [
          "Art & Design",
          "Gaming & Tech",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Partnered, dating separately.",
    "isVerified": false,
    "heritage": [
      "Afro‑Latin",
      "South Asian",
      "Middle Eastern"
    ],
    "orientations": [
      "Demisexual",
      "Homosexual"
    ],
    "datingStyles": [
      "Monogamish",
      "Non-Monogamous"
    ],
    "goals": [
      "Networking"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 5,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-47",
    "name": "Avery",
    "age": 47,
    "members": [
      {
        "name": "Avery",
        "age": 47,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / Caribbean",
          "Southeast Asian"
        ],
        "dynamics": [
          "Dominant",
          "Switch"
        ],
        "interests": [
          "Fitness & Wellness",
          "Food & Dining",
          "Art & Design"
        ]
      }
    ],
    "bio": "idk what to put here lol",
    "isVerified": false,
    "heritage": [
      "Black / Caribbean",
      "Southeast Asian"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 6,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-42",
    "name": "Alex",
    "age": 37,
    "members": [
      {
        "name": "Alex",
        "age": 37,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian",
          "South Asian"
        ],
        "dynamics": [
          "Progressive",
          "Traditional"
        ],
        "interests": [
          "Art & Design",
          "Gaming & Tech",
          "Food & Dining",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Hey",
    "isVerified": false,
    "heritage": [
      "East Asian",
      "South Asian"
    ],
    "orientations": [
      "Heterosexual"
    ],
    "datingStyles": [
      "Monogamish"
    ],
    "goals": [
      "Intimacy",
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 6,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-75",
    "name": "Ella & Zion & Alex & Harper",
    "age": 35,
    "members": [
      {
        "name": "Ella",
        "age": 45,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian",
          "Black / African"
        ],
        "dynamics": [
          "Submissive"
        ],
        "interests": [
          "Art & Design",
          "Travel & Outdoors"
        ]
      },
      {
        "name": "Zion",
        "age": 32,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "East Asian",
          "Western European"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Travel & Outdoors",
          "Nightlife & Parties",
          "Reading & Writing",
          "Art & Design"
        ]
      },
      {
        "name": "Alex",
        "age": 33,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Nightlife & Parties",
          "Reading & Writing",
          "Art & Design",
          "Food & Dining"
        ]
      },
      {
        "name": "Harper",
        "age": 29,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Let's grab tacos and margaritas.",
    "isVerified": true,
    "heritage": [
      "South Asian",
      "Black / African",
      "East Asian",
      "Western European"
    ],
    "orientations": [
      "Heterosexual",
      "Homosexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Dating",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 15,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-67",
    "name": "Casey & Elliott",
    "age": 40,
    "members": [
      {
        "name": "Casey",
        "age": 31,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Fitness & Wellness",
          "Reading & Writing",
          "Travel & Outdoors"
        ]
      },
      {
        "name": "Elliott",
        "age": 49,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Switch",
          "Submissive"
        ],
        "interests": [
          "Food & Dining",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "New here",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "Southeast Asian"
    ],
    "orientations": [
      "Demisexual",
      "Pansexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Dating",
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 6,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-77",
    "name": "Ella & Kendall & Sage & Harley",
    "age": 32,
    "members": [
      {
        "name": "Ella",
        "age": 38,
        "genderIdentity": "Woman",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Reading & Writing",
          "Travel & Outdoors",
          "Gaming & Tech",
          "Music & Concerts"
        ]
      },
      {
        "name": "Kendall",
        "age": 22,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Middle Eastern"
        ],
        "dynamics": [
          "Submissive",
          "Egalitarian"
        ],
        "interests": [
          "Travel & Outdoors",
          "Music & Concerts"
        ]
      },
      {
        "name": "Sage",
        "age": 31,
        "genderIdentity": "Man",
        "heritage": [
          "Afro‑Latin"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Reading & Writing",
          "Nightlife & Parties",
          "Gaming & Tech"
        ]
      },
      {
        "name": "Harley",
        "age": 36,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Art & Design",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Open-minded and curious.",
    "isVerified": false,
    "heritage": [
      "Southeast Asian",
      "Middle Eastern",
      "Afro‑Latin",
      "South Asian"
    ],
    "orientations": [
      "Demisexual"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Life Partner",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-58",
    "name": "Harley & Frankie",
    "age": 36,
    "members": [
      {
        "name": "Harley",
        "age": 34,
        "genderIdentity": "Man",
        "heritage": [
          "East Asian",
          "Western European"
        ],
        "dynamics": [
          "Switch",
          "Submissive"
        ],
        "interests": [
          "Reading & Writing",
          "Fitness & Wellness",
          "Nightlife & Parties",
          "Food & Dining"
        ]
      },
      {
        "name": "Frankie",
        "age": 37,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Egalitarian",
          "Switch"
        ],
        "interests": [
          "Reading & Writing",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Looking for someone to share laughs with.",
    "isVerified": false,
    "heritage": [
      "East Asian",
      "Western European",
      "South Asian"
    ],
    "orientations": [
      "Gay"
    ],
    "datingStyles": [
      "Monogamish"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-25",
    "name": "Sawyer",
    "age": 25,
    "members": [
      {
        "name": "Sawyer",
        "age": 25,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Western European"
        ],
        "dynamics": [
          "Dominant",
          "Progressive"
        ],
        "interests": [
          "Art & Design",
          "Reading & Writing",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Partnered, dating separately.",
    "isVerified": true,
    "heritage": [
      "Western European"
    ],
    "orientations": [
      "Pansexual",
      "Queer"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Dating",
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 13,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-48",
    "name": "Skyler",
    "age": 21,
    "members": [
      {
        "name": "Skyler",
        "age": 21,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian",
          "East Asian"
        ],
        "dynamics": [
          "Traditional",
          "Egalitarian"
        ],
        "interests": [
          "Food & Dining",
          "Art & Design",
          "Fitness & Wellness",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "idk what to put here lol",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "East Asian"
    ],
    "orientations": [
      "Heterosexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Open Relationship"
    ],
    "goals": [
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 2,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-65",
    "name": "Sutton & Frankie",
    "age": 36,
    "members": [
      {
        "name": "Sutton",
        "age": 33,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Gaming & Tech",
          "Art & Design"
        ]
      },
      {
        "name": "Frankie",
        "age": 38,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian",
          "Eastern European"
        ],
        "dynamics": [
          "Dominant",
          "Switch"
        ],
        "interests": [
          "Fitness & Wellness",
          "Nightlife & Parties",
          "Reading & Writing",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Ask me",
    "isVerified": false,
    "heritage": [
      "Southeast Asian",
      "Eastern European"
    ],
    "orientations": [
      "Homosexual",
      "Demisexual"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Casual",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 14,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-73",
    "name": "Rowan & Lane & Zion & Hannah",
    "age": 35,
    "members": [
      {
        "name": "Rowan",
        "age": 40,
        "genderIdentity": "Man",
        "heritage": [
          "North African",
          "South Asian"
        ],
        "dynamics": [
          "Switch",
          "Progressive"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Fitness & Wellness"
        ]
      },
      {
        "name": "Lane",
        "age": 23,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African",
          "Southeast Asian"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Reading & Writing",
          "Fitness & Wellness",
          "Food & Dining"
        ]
      },
      {
        "name": "Zion",
        "age": 28,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Submissive"
        ],
        "interests": [
          "Travel & Outdoors",
          "Reading & Writing",
          "Nightlife & Parties",
          "Food & Dining"
        ]
      },
      {
        "name": "Hannah",
        "age": 49,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian",
          "Black / African"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Food & Dining",
          "Art & Design",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "Always down for an adventure.",
    "isVerified": false,
    "heritage": [
      "North African",
      "South Asian",
      "Black / African",
      "Southeast Asian"
    ],
    "orientations": [
      "Homosexual",
      "Pansexual"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Casual"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523580494112-071d384e18c2?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 10,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-37",
    "name": "Charlie",
    "age": 22,
    "members": [
      {
        "name": "Charlie",
        "age": 22,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Middle Eastern"
        ],
        "dynamics": [
          "Traditional",
          "Egalitarian"
        ],
        "interests": [
          "Travel & Outdoors",
          "Nightlife & Parties",
          "Gaming & Tech",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Ask me",
    "isVerified": false,
    "heritage": [
      "Middle Eastern"
    ],
    "orientations": [
      "Demisexual",
      "Lesbian"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Life Partner",
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 1,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-55",
    "name": "Riley & Ella",
    "age": 25,
    "members": [
      {
        "name": "Riley",
        "age": 21,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Eastern European",
          "Southeast Asian"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Nightlife & Parties",
          "Travel & Outdoors",
          "Gaming & Tech"
        ]
      },
      {
        "name": "Ella",
        "age": 29,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Music & Concerts",
          "Gaming & Tech",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "We're a fun couple looking to meet new people.",
    "isVerified": false,
    "heritage": [
      "Eastern European",
      "Southeast Asian",
      "South Asian"
    ],
    "orientations": [
      "Heterosexual",
      "Homosexual"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-30",
    "name": "Elizabeth",
    "age": 33,
    "members": [
      {
        "name": "Elizabeth",
        "age": 33,
        "genderIdentity": "Woman",
        "heritage": [
          "South Asian",
          "North African"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Gaming & Tech",
          "Nightlife & Parties",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Here to make some memories.",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "North African"
    ],
    "orientations": [
      "Heterosexual",
      "Demisexual"
    ],
    "datingStyles": [
      "ENM / Open"
    ],
    "goals": [
      "Friends",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-43",
    "name": "Hayden",
    "age": 22,
    "members": [
      {
        "name": "Hayden",
        "age": 22,
        "genderIdentity": "Man",
        "heritage": [
          "Black / African",
          "Western European"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Art & Design",
          "Music & Concerts",
          "Nightlife & Parties"
        ]
      }
    ],
    "bio": "New here",
    "isVerified": false,
    "heritage": [
      "Black / African",
      "Western European"
    ],
    "orientations": [
      "Homosexual",
      "Lesbian"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512484776495-a09a92413a4a?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 8,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-46",
    "name": "Jesse",
    "age": 25,
    "members": [
      {
        "name": "Jesse",
        "age": 25,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Afro‑Latin",
          "North African"
        ],
        "dynamics": [
          "Traditional",
          "Egalitarian"
        ],
        "interests": [
          "Fitness & Wellness",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "idk what to put here lol",
    "isVerified": false,
    "heritage": [
      "Afro‑Latin",
      "North African"
    ],
    "orientations": [
      "Heterosexual"
    ],
    "datingStyles": [
      "ENM / Open"
    ],
    "goals": [
      "Travel Buddy",
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 5,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "REVOKED"
      }
    }
  },
  {
    "uid": "user-20",
    "name": "Cameron",
    "age": 22,
    "members": [
      {
        "name": "Cameron",
        "age": 22,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian",
          "Latin American"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Music & Concerts",
          "Nightlife & Parties",
          "Gaming & Tech",
          "Travel & Outdoors"
        ]
      }
    ],
    "bio": "Looking for someone to explore the city with.",
    "isVerified": false,
    "heritage": [
      "South Asian",
      "Latin American"
    ],
    "orientations": [
      "Demisexual",
      "Bisexual"
    ],
    "datingStyles": [
      "ENM / Open",
      "Monogamish"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 19,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-39",
    "name": "Jamie",
    "age": 39,
    "members": [
      {
        "name": "Jamie",
        "age": 39,
        "genderIdentity": "Man",
        "heritage": [
          "Afro‑Latin",
          "Black / Caribbean"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Art & Design",
          "Food & Dining",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Hey",
    "isVerified": false,
    "heritage": [
      "Afro‑Latin",
      "Black / Caribbean"
    ],
    "orientations": [
      "Heterosexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 4,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "APPROVED"
      }
    }
  },
  {
    "uid": "user-8",
    "name": "Alex",
    "age": 35,
    "members": [
      {
        "name": "Alex",
        "age": 35,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Prefer not to say"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Music & Concerts",
          "Reading & Writing",
          "Art & Design"
        ]
      }
    ],
    "bio": "Love hiking, coffee, and good conversations.",
    "isVerified": false,
    "heritage": [
      "Prefer not to say"
    ],
    "orientations": [
      "Bisexual",
      "Homoflexible"
    ],
    "datingStyles": [
      "Non-Monogamous",
      "Open Relationship"
    ],
    "goals": [
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-35",
    "name": "Ashton",
    "age": 45,
    "members": [
      {
        "name": "Ashton",
        "age": 45,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Western European",
          "Latin American"
        ],
        "dynamics": [
          "Progressive"
        ],
        "interests": [
          "Gaming & Tech",
          "Fitness & Wellness",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Ethically non-monogamous. Communication is key.",
    "isVerified": false,
    "heritage": [
      "Western European",
      "Latin American"
    ],
    "orientations": [
      "Lesbian",
      "Pansexual"
    ],
    "datingStyles": [
      "Exploring",
      "Non-Monogamous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-26",
    "name": "Avery",
    "age": 38,
    "members": [
      {
        "name": "Avery",
        "age": 38,
        "genderIdentity": "Woman",
        "heritage": [
          "Western European",
          "South Asian"
        ],
        "dynamics": [
          "Dominant",
          "Switch"
        ],
        "interests": [
          "Reading & Writing",
          "Fitness & Wellness",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Coffee addict and bookworm.",
    "isVerified": false,
    "heritage": [
      "Western European",
      "South Asian"
    ],
    "orientations": [
      "Demisexual"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Life Partner",
      "Dating"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 37,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-40",
    "name": "Riley",
    "age": 36,
    "members": [
      {
        "name": "Riley",
        "age": 36,
        "genderIdentity": "Man",
        "heritage": [
          "South Asian"
        ],
        "dynamics": [
          "Traditional",
          "Dominant"
        ],
        "interests": [
          "Gaming & Tech",
          "Art & Design",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Ask me",
    "isVerified": false,
    "heritage": [
      "South Asian"
    ],
    "orientations": [
      "Demisexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 17,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-3",
    "name": "Jordan",
    "age": 36,
    "members": [
      {
        "name": "Jordan",
        "age": 36,
        "genderIdentity": "Man",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Dominant",
          "Egalitarian"
        ],
        "interests": [
          "Fitness & Wellness",
          "Art & Design",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Love hiking, coffee, and good conversations.",
    "isVerified": true,
    "heritage": [
      "Southeast Asian"
    ],
    "orientations": [
      "Heterosexual"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Dating",
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 14,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-13",
    "name": "Zoey",
    "age": 42,
    "members": [
      {
        "name": "Zoey",
        "age": 42,
        "genderIdentity": "Woman",
        "heritage": [
          "Middle Eastern"
        ],
        "dynamics": [
          "Submissive",
          "Traditional"
        ],
        "interests": [
          "Reading & Writing",
          "Gaming & Tech",
          "Art & Design",
          "Music & Concerts"
        ]
      }
    ],
    "bio": "Always down for an adventure.",
    "isVerified": false,
    "heritage": [
      "Middle Eastern"
    ],
    "orientations": [
      "Lesbian",
      "Pansexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Travel Buddy",
      "Casual"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 11,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-7",
    "name": "Amelia",
    "age": 38,
    "members": [
      {
        "name": "Amelia",
        "age": 38,
        "genderIdentity": "Woman",
        "heritage": [
          "North African"
        ],
        "dynamics": [
          "Dominant",
          "Submissive"
        ],
        "interests": [
          "Nightlife & Parties",
          "Music & Concerts",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Let's go to a museum or art gallery.",
    "isVerified": true,
    "heritage": [
      "North African"
    ],
    "orientations": [
      "Homoflexible",
      "Heteroflexible"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Casual",
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 6,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-21",
    "name": "Hunter",
    "age": 34,
    "members": [
      {
        "name": "Hunter",
        "age": 34,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Western European"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Art & Design",
          "Reading & Writing",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Here for a good time, not a long time.",
    "isVerified": false,
    "heritage": [
      "Western European"
    ],
    "orientations": [
      "Gay",
      "Heterosexual"
    ],
    "datingStyles": [
      "Polyamorous"
    ],
    "goals": [
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 18,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-9",
    "name": "Riley",
    "age": 28,
    "members": [
      {
        "name": "Riley",
        "age": 28,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Southeast Asian"
        ],
        "dynamics": [
          "Traditional"
        ],
        "interests": [
          "Gaming & Tech",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Looking for a plus one for concerts and events.",
    "isVerified": true,
    "heritage": [
      "Southeast Asian"
    ],
    "orientations": [
      "Heteroflexible",
      "Pansexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 23,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-38",
    "name": "Quinn",
    "age": 44,
    "members": [
      {
        "name": "Quinn",
        "age": 44,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Western European",
          "Black / Caribbean"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Reading & Writing",
          "Music & Concerts",
          "Art & Design"
        ]
      }
    ],
    "bio": "Ask me",
    "isVerified": false,
    "heritage": [
      "Western European",
      "Black / Caribbean"
    ],
    "orientations": [
      "Bisexual"
    ],
    "datingStyles": [
      "Monogamous"
    ],
    "goals": [
      "Dating"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 4,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-2",
    "name": "Zoe",
    "age": 33,
    "members": [
      {
        "name": "Zoe",
        "age": 33,
        "genderIdentity": "Woman",
        "heritage": [
          "Black / African"
        ],
        "dynamics": [
          "Egalitarian"
        ],
        "interests": [
          "Gaming & Tech",
          "Travel & Outdoors",
          "Art & Design"
        ]
      }
    ],
    "bio": "Swipe right if you like bad puns.",
    "isVerified": true,
    "heritage": [
      "Black / African"
    ],
    "orientations": [
      "Asexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Casual",
      "Networking"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 8,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-22",
    "name": "Avery",
    "age": 26,
    "members": [
      {
        "name": "Avery",
        "age": 26,
        "genderIdentity": "Woman",
        "heritage": [
          "Middle Eastern",
          "Eastern European"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Travel & Outdoors",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Looking for someone to share laughs with.",
    "isVerified": false,
    "heritage": [
      "Middle Eastern",
      "Eastern European"
    ],
    "orientations": [
      "Pansexual",
      "Homoflexible"
    ],
    "datingStyles": [
      "ENM / Open"
    ],
    "goals": [
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 7,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-23",
    "name": "Jesse",
    "age": 29,
    "members": [
      {
        "name": "Jesse",
        "age": 29,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Latin American"
        ],
        "dynamics": [
          "Dominant",
          "Traditional"
        ],
        "interests": [
          "Gaming & Tech",
          "Reading & Writing",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Looking for someone to binge-watch shows with.",
    "isVerified": true,
    "heritage": [
      "Latin American"
    ],
    "orientations": [
      "Demisexual"
    ],
    "datingStyles": [
      "ENM / Open"
    ],
    "goals": [
      "Intimacy",
      "Mentorship"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 3,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-1",
    "name": "Logan",
    "age": 28,
    "members": [
      {
        "name": "Logan",
        "age": 28,
        "genderIdentity": "Man",
        "heritage": [
          "Afro‑Latin",
          "Southeast Asian"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Reading & Writing",
          "Nightlife & Parties",
          "Fitness & Wellness"
        ]
      }
    ],
    "bio": "Love hiking, coffee, and good conversations.",
    "isVerified": true,
    "heritage": [
      "Afro‑Latin",
      "Southeast Asian"
    ],
    "orientations": [
      "Bisexual",
      "Gay"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 6,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-10",
    "name": "Ellie",
    "age": 31,
    "members": [
      {
        "name": "Ellie",
        "age": 31,
        "genderIdentity": "Woman",
        "heritage": [
          "North African",
          "Black / African"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Music & Concerts",
          "Travel & Outdoors",
          "Fitness & Wellness",
          "Food & Dining"
        ]
      }
    ],
    "bio": "Let's grab tacos and margaritas.",
    "isVerified": false,
    "heritage": [
      "North African",
      "Black / African"
    ],
    "orientations": [
      "Pansexual"
    ],
    "datingStyles": [
      "Monogamous",
      "Non-Monogamous"
    ],
    "goals": [
      "Intimacy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 8,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-18",
    "name": "Casey",
    "age": 22,
    "members": [
      {
        "name": "Casey",
        "age": 22,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Southeast Asian",
          "Eastern European"
        ],
        "dynamics": [
          "Dominant",
          "Egalitarian"
        ],
        "interests": [
          "Nightlife & Parties",
          "Reading & Writing",
          "Gaming & Tech"
        ]
      }
    ],
    "bio": "Looking for a third to join us for drinks.",
    "isVerified": false,
    "heritage": [
      "Southeast Asian",
      "Eastern European"
    ],
    "orientations": [
      "Demisexual"
    ],
    "datingStyles": [
      "Exploring"
    ],
    "goals": [
      "Life Partner"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  },
  {
    "uid": "user-19",
    "name": "Jamie",
    "age": 22,
    "members": [
      {
        "name": "Jamie",
        "age": 22,
        "genderIdentity": "Prefer not to say",
        "heritage": [
          "Black / African"
        ],
        "dynamics": [
          "Switch"
        ],
        "interests": [
          "Gaming & Tech",
          "Food & Dining",
          "Reading & Writing"
        ]
      }
    ],
    "bio": "Let's go to a museum or art gallery.",
    "isVerified": false,
    "heritage": [
      "Black / African"
    ],
    "orientations": [
      "Asexual",
      "Bisexual"
    ],
    "datingStyles": [
      "Open Relationship",
      "Monogamous"
    ],
    "goals": [
      "Travel Buddy"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 18,
    "visibilityMode": "PUBLIC",
    "visibleToIds": []
  },
  {
    "uid": "user-16",
    "name": "Jesse",
    "age": 24,
    "members": [
      {
        "name": "Jesse",
        "age": 24,
        "genderIdentity": "Non-Binary",
        "heritage": [
          "Afro‑Latin"
        ],
        "dynamics": [
          "Dominant"
        ],
        "interests": [
          "Nightlife & Parties",
          "Music & Concerts",
          "Art & Design"
        ]
      }
    ],
    "bio": "Looking for someone to share my passions with.",
    "isVerified": false,
    "heritage": [
      "Afro‑Latin"
    ],
    "orientations": [
      "Homosexual"
    ],
    "datingStyles": [
      "Open Relationship"
    ],
    "goals": [
      "Life Partner",
      "Friends"
    ],
    "photos": [
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80"
    ],
    "distance": 9,
    "visibilityMode": "PUBLIC",
    "visibleToIds": [],
    "privateGallery": {
      "photos": [
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80"
      ],
      "access": {
        "current-user-123": "LOCKED"
      }
    }
  }
];
export const INITIAL_CHATS: ChatConversation[] = [
  {
    "id": "chat-user-17",
    "user": {
      "uid": "user-17",
      "name": "Mila",
      "age": 46,
      "members": [
        {
          "name": "Mila",
          "age": 46,
          "genderIdentity": "Woman",
          "heritage": [
            "Western European"
          ],
          "dynamics": [
            "Progressive",
            "Egalitarian"
          ],
          "interests": [
            "Reading & Writing",
            "Food & Dining",
            "Nightlife & Parties",
            "Music & Concerts"
          ]
        }
      ],
      "bio": "Sapiosexual. Let's talk about the universe.",
      "isVerified": false,
      "heritage": [
        "Western European"
      ],
      "orientations": [
        "Heterosexual"
      ],
      "datingStyles": [
        "Open Relationship",
        "Monogamous"
      ],
      "goals": [
        "Life Partner"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 5,
      "visibilityMode": "PUBLIC",
      "visibleToIds": []
    },
    "lastMessage": "Pretty good, just relaxing. You?",
    "time": "1h ago",
    "unread": false,
    "status": "ACTIVE",
    "messages": [
      {
        "id": "m1",
        "senderId": "user-17",
        "text": "Hey! How's it going?",
        "timestamp": 1773869569597,
        "status": "read",
        "type": "USER"
      },
      {
        "id": "m2",
        "senderId": "current-user-123",
        "text": "Pretty good, just relaxing. You?",
        "timestamp": 1773871369597,
        "status": "read",
        "type": "USER"
      }
    ]
  },
  {
    "id": "chat-user-57",
    "user": {
      "uid": "user-57",
      "name": "Cameron & Chloe",
      "age": 25,
      "members": [
        {
          "name": "Cameron",
          "age": 23,
          "genderIdentity": "Non-Binary",
          "heritage": [
            "South Asian",
            "East Asian"
          ],
          "dynamics": [
            "Dominant",
            "Submissive"
          ],
          "interests": [
            "Travel & Outdoors",
            "Art & Design"
          ]
        },
        {
          "name": "Chloe",
          "age": 27,
          "genderIdentity": "Woman",
          "heritage": [
            "North African"
          ],
          "dynamics": [
            "Dominant"
          ],
          "interests": [
            "Art & Design",
            "Food & Dining"
          ]
        }
      ],
      "bio": "Looking for a genuine connection.",
      "isVerified": true,
      "heritage": [
        "South Asian",
        "East Asian",
        "North African"
      ],
      "orientations": [
        "Heterosexual",
        "Lesbian"
      ],
      "datingStyles": [
        "Non-Monogamous"
      ],
      "goals": [
        "Intimacy"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 40,
      "visibilityMode": "PUBLIC",
      "visibleToIds": [],
      "privateGallery": {
        "photos": [
          "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
        ],
        "access": {
          "current-user-123": "LOCKED"
        }
      }
    },
    "lastMessage": "What are you up to this weekend?",
    "time": "2h ago",
    "unread": true,
    "status": "ACTIVE",
    "messages": [
      {
        "id": "m1",
        "senderId": "current-user-123",
        "text": "Love your profile!",
        "timestamp": 1773865969597,
        "status": "read",
        "type": "USER"
      },
      {
        "id": "m2",
        "senderId": "user-57",
        "text": "Thanks! I like yours too.",
        "timestamp": 1773867769597,
        "status": "read",
        "type": "USER"
      },
      {
        "id": "m3",
        "senderId": "user-57",
        "text": "What are you up to this weekend?",
        "timestamp": 1773869569597,
        "status": "delivered",
        "type": "USER"
      }
    ]
  },
  {
    "id": "chat-user-4",
    "user": {
      "uid": "user-4",
      "name": "Sage",
      "age": 36,
      "members": [
        {
          "name": "Sage",
          "age": 36,
          "genderIdentity": "Non-Binary",
          "heritage": [
            "Middle Eastern",
            "Prefer not to say"
          ],
          "dynamics": [
            "Dominant"
          ],
          "interests": [
            "Nightlife & Parties",
            "Reading & Writing",
            "Food & Dining",
            "Fitness & Wellness"
          ]
        }
      ],
      "bio": "Open to meeting couples",
      "isVerified": true,
      "heritage": [
        "Middle Eastern",
        "Prefer not to say"
      ],
      "orientations": [
        "Heteroflexible",
        "Heterosexual"
      ],
      "datingStyles": [
        "Open Relationship"
      ],
      "goals": [
        "Travel Buddy",
        "Intimacy"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 36,
      "visibilityMode": "GHOST",
      "visibleToIds": [],
      "privateGallery": {
        "photos": [
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
        ],
        "access": {
          "current-user-123": "REQUESTED"
        }
      }
    },
    "lastMessage": "Hey there! I saw we matched and wanted to say hi.",
    "time": "Just now",
    "unread": true,
    "status": "PENDING_INTRO",
    "messages": [
      {
        "id": "m1",
        "senderId": "user-4",
        "text": "Hey there! I saw we matched and wanted to say hi.",
        "timestamp": 1773873109597,
        "status": "delivered",
        "type": "USER"
      }
    ]
  },
  {
    "id": "chat-user-70",
    "user": {
      "uid": "user-70",
      "name": "Eleanor & Scarlett",
      "age": 37,
      "members": [
        {
          "name": "Eleanor",
          "age": 27,
          "genderIdentity": "Woman",
          "heritage": [
            "Prefer not to say"
          ],
          "dynamics": [
            "Traditional"
          ],
          "interests": [
            "Travel & Outdoors",
            "Food & Dining",
            "Music & Concerts"
          ]
        },
        {
          "name": "Scarlett",
          "age": 46,
          "genderIdentity": "Woman",
          "heritage": [
            "Middle Eastern",
            "East Asian"
          ],
          "dynamics": [
            "Progressive",
            "Egalitarian"
          ],
          "interests": [
            "Gaming & Tech",
            "Reading & Writing",
            "Music & Concerts"
          ]
        }
      ],
      "bio": "idk what to put here lol",
      "isVerified": false,
      "heritage": [
        "Prefer not to say",
        "Middle Eastern",
        "East Asian"
      ],
      "orientations": [
        "Queer"
      ],
      "datingStyles": [
        "Polyamorous",
        "ENM / Open"
      ],
      "goals": [
        "Networking"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 17,
      "visibilityMode": "PUBLIC",
      "visibleToIds": []
    },
    "lastMessage": "Approved access to private photos",
    "time": "5h ago",
    "unread": false,
    "status": "ACTIVE",
    "messages": [
      {
        "id": "m1",
        "senderId": "current-user-123",
        "text": "Hey!",
        "timestamp": 1773855169597,
        "status": "read",
        "type": "USER"
      },
      {
        "id": "m2",
        "senderId": "user-70",
        "text": "Hi! How are you?",
        "timestamp": 1773858769597,
        "status": "read",
        "type": "USER"
      },
      {
        "id": "m3",
        "senderId": "current-user-123",
        "text": "Requested access to private photos",
        "timestamp": 1773862369597,
        "status": "read",
        "type": "SYSTEM"
      },
      {
        "id": "m4",
        "senderId": "user-70",
        "text": "Approved access to private photos",
        "timestamp": 1773865969597,
        "status": "read",
        "type": "SYSTEM"
      }
    ]
  },
  {
    "id": "chat-user-11",
    "user": {
      "uid": "user-11",
      "name": "Morgan",
      "age": 24,
      "members": [
        {
          "name": "Morgan",
          "age": 24,
          "genderIdentity": "Man",
          "heritage": [
            "Middle Eastern",
            "Prefer not to say"
          ],
          "dynamics": [
            "Dominant",
            "Submissive"
          ],
          "interests": [
            "Travel & Outdoors",
            "Music & Concerts"
          ]
        }
      ],
      "bio": "Not great at bios, ask me anything",
      "isVerified": false,
      "heritage": [
        "Middle Eastern",
        "Prefer not to say"
      ],
      "orientations": [
        "Bisexual",
        "Queer"
      ],
      "datingStyles": [
        "Polyamorous"
      ],
      "goals": [
        "Mentorship"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 9,
      "visibilityMode": "PUBLIC",
      "visibleToIds": [],
      "privateGallery": {
        "photos": [
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80"
        ],
        "access": {
          "current-user-123": "REQUESTED"
        }
      }
    },
    "lastMessage": "Hey",
    "time": "1d ago",
    "unread": true,
    "status": "ACTIVE",
    "messages": [
      {
        "id": "m1",
        "senderId": "user-11",
        "text": "Hey",
        "timestamp": 1773786769597,
        "status": "delivered",
        "type": "USER"
      }
    ]
  }
];
export const INITIAL_ACTIVITIES: any[] = [
  {
    "id": "act-1",
    "type": "PHOTO",
    "text": "Updated photo",
    "timestamp": "2h ago",
    "matchUser": {
      "uid": "user-17",
      "name": "Mila",
      "age": 46,
      "members": [
        {
          "name": "Mila",
          "age": 46,
          "genderIdentity": "Woman",
          "heritage": [
            "Western European"
          ],
          "dynamics": [
            "Progressive",
            "Egalitarian"
          ],
          "interests": [
            "Reading & Writing",
            "Food & Dining",
            "Nightlife & Parties",
            "Music & Concerts"
          ]
        }
      ],
      "bio": "Sapiosexual. Let's talk about the universe.",
      "isVerified": false,
      "heritage": [
        "Western European"
      ],
      "orientations": [
        "Heterosexual"
      ],
      "datingStyles": [
        "Open Relationship",
        "Monogamous"
      ],
      "goals": [
        "Life Partner"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 5,
      "visibilityMode": "PUBLIC",
      "visibleToIds": []
    }
  },
  {
    "id": "act-2",
    "type": "BIO",
    "text": "Updated bio",
    "timestamp": "5h ago",
    "matchUser": {
      "uid": "user-57",
      "name": "Cameron & Chloe",
      "age": 25,
      "members": [
        {
          "name": "Cameron",
          "age": 23,
          "genderIdentity": "Non-Binary",
          "heritage": [
            "South Asian",
            "East Asian"
          ],
          "dynamics": [
            "Dominant",
            "Submissive"
          ],
          "interests": [
            "Travel & Outdoors",
            "Art & Design"
          ]
        },
        {
          "name": "Chloe",
          "age": 27,
          "genderIdentity": "Woman",
          "heritage": [
            "North African"
          ],
          "dynamics": [
            "Dominant"
          ],
          "interests": [
            "Art & Design",
            "Food & Dining"
          ]
        }
      ],
      "bio": "Looking for a genuine connection.",
      "isVerified": true,
      "heritage": [
        "South Asian",
        "East Asian",
        "North African"
      ],
      "orientations": [
        "Heterosexual",
        "Lesbian"
      ],
      "datingStyles": [
        "Non-Monogamous"
      ],
      "goals": [
        "Intimacy"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515536765-9b2a70c4b333?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 40,
      "visibilityMode": "PUBLIC",
      "visibleToIds": [],
      "privateGallery": {
        "photos": [
          "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
        ],
        "access": {
          "current-user-123": "LOCKED"
        }
      }
    }
  },
  {
    "id": "act-3",
    "type": "VERIFICATION",
    "text": "Verification updated",
    "timestamp": "1d ago",
    "matchUser": {
      "uid": "user-4",
      "name": "Sage",
      "age": 36,
      "members": [
        {
          "name": "Sage",
          "age": 36,
          "genderIdentity": "Non-Binary",
          "heritage": [
            "Middle Eastern",
            "Prefer not to say"
          ],
          "dynamics": [
            "Dominant"
          ],
          "interests": [
            "Nightlife & Parties",
            "Reading & Writing",
            "Food & Dining",
            "Fitness & Wellness"
          ]
        }
      ],
      "bio": "Open to meeting couples",
      "isVerified": true,
      "heritage": [
        "Middle Eastern",
        "Prefer not to say"
      ],
      "orientations": [
        "Heteroflexible",
        "Heterosexual"
      ],
      "datingStyles": [
        "Open Relationship"
      ],
      "goals": [
        "Travel Buddy",
        "Intimacy"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506863530036-1ef0d46fd259?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 36,
      "visibilityMode": "GHOST",
      "visibleToIds": [],
      "privateGallery": {
        "photos": [
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=800&q=80"
        ],
        "access": {
          "current-user-123": "REQUESTED"
        }
      }
    }
  },
  {
    "id": "act-4",
    "type": "MATCH",
    "text": "Mutual match",
    "timestamp": "2d ago",
    "matchUser": {
      "uid": "user-70",
      "name": "Eleanor & Scarlett",
      "age": 37,
      "members": [
        {
          "name": "Eleanor",
          "age": 27,
          "genderIdentity": "Woman",
          "heritage": [
            "Prefer not to say"
          ],
          "dynamics": [
            "Traditional"
          ],
          "interests": [
            "Travel & Outdoors",
            "Food & Dining",
            "Music & Concerts"
          ]
        },
        {
          "name": "Scarlett",
          "age": 46,
          "genderIdentity": "Woman",
          "heritage": [
            "Middle Eastern",
            "East Asian"
          ],
          "dynamics": [
            "Progressive",
            "Egalitarian"
          ],
          "interests": [
            "Gaming & Tech",
            "Reading & Writing",
            "Music & Concerts"
          ]
        }
      ],
      "bio": "idk what to put here lol",
      "isVerified": false,
      "heritage": [
        "Prefer not to say",
        "Middle Eastern",
        "East Asian"
      ],
      "orientations": [
        "Queer"
      ],
      "datingStyles": [
        "Polyamorous",
        "ENM / Open"
      ],
      "goals": [
        "Networking"
      ],
      "photos": [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
      ],
      "distance": 17,
      "visibilityMode": "PUBLIC",
      "visibleToIds": []
    }
  }
];

const USER_SCHEMA_VERSION = 2;

function migrateUser(user: any): User {
  const migrated = { ...user };
  
  if (!migrated.entitlements) {
    const plan = migrated.plan || "FREE";
    migrated.entitlements = {
      plan: plan,
      imCredits: migrated.imCreditsBalance || 0,
      ghostMode: plan === "PLUS" || plan === "PRO",
      privatePhotos: plan === "PLUS" || plan === "PRO"
    };
  } else {
    const plan = migrated.entitlements.plan || migrated.plan || "FREE";
    migrated.entitlements.plan = plan;
    migrated.entitlements.ghostMode = plan === "PLUS" || plan === "PRO";
    migrated.entitlements.privatePhotos = plan === "PLUS" || plan === "PRO";
    migrated.entitlements.imCredits = migrated.entitlements.imCredits ?? (migrated.imCreditsBalance || 0);
  }

  delete migrated.plan;
  delete migrated.imCreditsBalance;
  delete migrated.monthlyIMUsed;
  delete migrated.monthlyResetAt;

  migrated.__schemaVersion = USER_SCHEMA_VERSION;
  return migrated;
}

class MockServiceClass {
  public mockReady: boolean = false;
  private seedEnsured: boolean = false;
  private currentUser: User;
  private candidates: User[];
  private likesYou: User[];
  private liked: User[];
  private passed: User[];
  private matches: User[];
  private chats: ChatConversation[];
  private newMatches: (User & { isInstaMsg?: boolean })[];
  private reports: { entityId: string, reason: string, details?: string, timestamp: number }[] = [];

  constructor() {
    this.reset();
  }

  clearSession() {
    localStorage.removeItem('dev_mock_user');
    this.reset();
  }

  reset() {
    this.mockReady = false;
    const savedUser = localStorage.getItem('dev_mock_user');
    if (savedUser) {
      try {
        let user = JSON.parse(savedUser);
        if (user.__schemaVersion !== USER_SCHEMA_VERSION) {
          try {
            user = migrateUser(user);
            localStorage.setItem('dev_mock_user', JSON.stringify(user));
          } catch (e) {
            user = JSON.parse(JSON.stringify(INITIAL_CURRENT_USER));
            localStorage.setItem('dev_mock_user', JSON.stringify(user));
          }
        }
        this.currentUser = user;
      } catch (e) {
        this.currentUser = JSON.parse(JSON.stringify(INITIAL_CURRENT_USER));
        localStorage.setItem('dev_mock_user', JSON.stringify(this.currentUser));
      }
    } else {
      this.currentUser = JSON.parse(JSON.stringify(INITIAL_CURRENT_USER));
      localStorage.setItem('dev_mock_user', JSON.stringify(this.currentUser));
    }
    
    if (!this.currentUser) {
      this.currentUser = JSON.parse(JSON.stringify(INITIAL_CURRENT_USER));
      localStorage.setItem('dev_mock_user', JSON.stringify(this.currentUser));
    }

    this.candidates = JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
    this.likesYou = JSON.parse(JSON.stringify(INITIAL_LIKES_YOU));
    this.liked = [];
    this.passed = [];
    this.matches = []; // Start empty
    this.chats = [];
    this.newMatches = []; // Start empty
    this.reports = [];
    
    this.mockReady = true;
  }

  ensureSeed() {
    if (this.seedEnsured) return;
    this.seedEnsured = true;
    
    if (this.candidates.length === 0) {
      this.candidates = JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
    }
  }

  private saveUser() {
    localStorage.setItem('dev_mock_user', JSON.stringify(this.currentUser));
  }

  // --- PRIVATE GALLERY ---
  appendSystemMessage(targetId: string, viewerId: string, text: string) {
    const otherUserId = targetId === this.currentUser.uid ? viewerId : targetId;
    let chat = this.chats.find(c => c.user.uid === otherUserId);
    if (!chat) {
      const otherUser = this.getUserById(otherUserId);
      if (!otherUser) return;
      chat = {
        id: `chat-${otherUserId}`,
        user: otherUser,
        lastMessage: text,
        time: 'Just now',
        unread: false,
        status: 'PENDING_INTRO',
        messages: []
      };
      this.chats.unshift(chat);
    }
    
    chat.messages = chat.messages || [];
    chat.messages.push({
      id: `sys-${Date.now()}-0.27237987912954864`,
      senderId: 'SYSTEM',
      text,
      timestamp: { toDate: () => new Date() },
      status: 'sent',
      type: 'SYSTEM'
    } as any);
    
    chat.lastMessage = text;
    chat.time = 'Just now';
  }

  requestPrivateGalleryAccess(targetId: string, viewerId: string, source: 'PROFILE' | 'CHAT' = 'PROFILE') {
    const target = this.getUserById(targetId);
    const viewer = viewerId === this.currentUser.uid ? this.currentUser : this.getUserById(viewerId);
    
    if (target && target.privateGallery && viewer) {
      const isPlusOrPro = viewer.entitlements?.plan === 'PLUS' || viewer.entitlements?.plan === 'PRO';
      const isMatch = this.matches.some(u => u.uid === targetId) || this.newMatches.some(u => u.uid === targetId);

      if (!isPlusOrPro) {
        if (!isMatch || source !== 'CHAT') {
          return {
            success: false,
            message: "Match first to request private photos in chat."
          };
        }
      }
      
      target.privateGallery.access[viewerId] = 'REQUESTED';
      this.appendSystemMessage(targetId, viewerId, "Requested access to private photos");
      pushService.notify('PRIVATE_PHOTO_REQUESTED', { targetId, viewerId });
      return { success: true };
    }
    return { success: false, message: "User not found" };
  }

  cancelPrivateGalleryAccess(targetId: string, viewerId: string) {
    const target = this.getUserById(targetId);
    if (target && target.privateGallery) {
      target.privateGallery.access[viewerId] = 'LOCKED';
      this.appendSystemMessage(targetId, viewerId, "Canceled private photo request");
    }
  }

  approvePrivateGalleryAccess(ownerId: string, viewerId: string) {
    const owner = this.getUserById(ownerId);
    if (owner && owner.privateGallery) {
      owner.privateGallery.access[viewerId] = 'APPROVED';
      this.appendSystemMessage(ownerId, viewerId, "Approved access to private photos");
      pushService.notify('PRIVATE_PHOTO_APPROVED', { ownerId, viewerId });
    }
  }

  revokePrivateGalleryAccess(ownerId: string, viewerId: string) {
    const owner = this.getUserById(ownerId);
    if (owner && owner.privateGallery) {
      owner.privateGallery.access[viewerId] = 'REVOKED';
      this.appendSystemMessage(ownerId, viewerId, "Revoked access to private photos");
      pushService.notify('PRIVATE_PHOTO_REVOKED', { ownerId, viewerId });
    }
  }

  denyPrivateGalleryAccess(ownerId: string, viewerId: string) {
    const owner = this.getUserById(ownerId);
    if (owner && owner.privateGallery) {
      owner.privateGallery.access[viewerId] = 'LOCKED';
      this.appendSystemMessage(ownerId, viewerId, "Denied request for private photos");
    }
  }

  getUserById(uid: string): User | undefined {
    if (this.currentUser.uid === uid) return this.currentUser;
    const allUsers = [...this.candidates, ...this.likesYou, ...this.liked, ...this.passed, ...this.matches, ...this.newMatches];
    return allUsers.find(u => u.uid === uid) || this.chats.find(c => c.user.uid === uid)?.user;
  }

  // --- GETTERS ---
  getCurrentUser() { 
    billingService.applyMonthlyAllowanceIfDue(this.currentUser);
    return this.currentUser; 
  }
  
  getCandidates() { 
    this.ensureSeed();
    // Requirement 2: Ensure we filter out any profile that exists in other lists
    const excludedIds = new Set([
      ...this.liked.map(u => u.uid),
      ...this.passed.map(u => u.uid),
      ...this.matches.map(u => u.uid),
      ...this.chats.map(c => c.user.uid),
      ...(this.currentUser.blockedEntityIds || [])
    ]);
    
    return this.candidates.filter(u => {
      if (excludedIds.has(u.uid)) return false;
      // Ghost Mode enforcement:
      // If candidate is GHOST, they ONLY appear if they have explicitly made themselves visible to the viewer (e.g. by liking them first)
      if (u.visibilityMode === 'GHOST') {
        const isVisibleToMe = u.visibleToIds?.includes(this.currentUser.uid);
        if (!isVisibleToMe) return false;
      }
      return true;
    });
  }

  getLikesYou() { 
    const blockedIds = new Set(this.currentUser.blockedEntityIds || []);
    return this.likesYou.filter(u => !blockedIds.has(u.uid)); 
  }
  
  getLiked() { 
    const blockedIds = new Set(this.currentUser.blockedEntityIds || []);
    return this.liked.filter(u => !blockedIds.has(u.uid)); 
  }
  
  getPassed() { 
    const blockedIds = new Set(this.currentUser.blockedEntityIds || []);
    return this.passed.filter(u => !blockedIds.has(u.uid)); 
  }
  
  getMatches() { 
    const blockedIds = new Set(this.currentUser.blockedEntityIds || []);
    return this.matches.filter(u => !blockedIds.has(u.uid)); 
  }
  


  getChats() { 
    const blockedIds = new Set(this.currentUser.blockedEntityIds || []);
    return this.chats.filter(c => !blockedIds.has(c.user.uid)); 
  }
  
  getNewMatches() { 
    const blockedIds = new Set(this.currentUser.blockedEntityIds || []);
    return this.newMatches.filter(u => !blockedIds.has(u.uid)); 
  }

  // --- ACTIONS ---
  
  blockEntity(entityId: string) {
    if (CONFIG.DATA_MODE === 'firebase') {
      FirebaseFunctionsStubs.blockEntity(this.currentUser.uid, entityId);
    }
    
    if (!this.currentUser.blockedEntityIds) {
      this.currentUser.blockedEntityIds = [];
    }
    if (!this.currentUser.blockedEntityIds.includes(entityId)) {
      this.currentUser.blockedEntityIds.push(entityId);
    }
    
    // Revoke private gallery access in both directions
    const target = this.getUserById(entityId);
    if (target && target.privateGallery && target.privateGallery.access[this.currentUser.uid]) {
      target.privateGallery.access[this.currentUser.uid] = 'LOCKED';
    }
    if (this.currentUser.privateGallery && this.currentUser.privateGallery.access[entityId]) {
      this.currentUser.privateGallery.access[entityId] = 'LOCKED';
    }
  }

  reportEntity(entityId: string, reason: string, details?: string) {
    if (CONFIG.DATA_MODE === 'firebase') {
      FirebaseFunctionsStubs.reportEntity(this.currentUser.uid, entityId, reason, details);
    }
    
    // console.log(`[MockService] Reported entity ${entityId} for ${reason}`);
    this.reports.push({
      entityId,
      reason,
      details,
      timestamp: Date.now()
    });
    
    // Automatically block the user when reported
    this.blockEntity(entityId);
  }

  getPushLogs() {
    return pushService.getLogs();
  }

  updateCurrentUser(user: User) {
    this.currentUser = { ...user };
    this.saveUser();
  }

  canLike(): boolean {
    if (this.currentUser.entitlements?.plan === 'PLUS' || this.currentUser.entitlements?.plan === 'PRO') return true;
    
    const limit = this.currentUser.likeQuotaLimit ?? 20;
    const used = this.currentUser.likeQuotaUsed || 0;
    const windowStart = this.currentUser.likeQuotaWindowStart;
    
    if (!windowStart) return true;
    
    const now = Date.now();
    if (now - windowStart >= 24 * 60 * 60 * 1000) {
      return true;
    }
    
    return used < limit;
  }

  recordLike(): User {
    if (this.currentUser.entitlements?.plan === 'PLUS' || this.currentUser.entitlements?.plan === 'PRO') return this.currentUser;
    
    const now = Date.now();
    const windowStart = this.currentUser.likeQuotaWindowStart;
    
    if (!windowStart || now - windowStart >= 24 * 60 * 60 * 1000) {
      this.currentUser.likeQuotaWindowStart = now;
      this.currentUser.likeQuotaUsed = 1;
    } else {
      this.currentUser.likeQuotaUsed = (this.currentUser.likeQuotaUsed || 0) + 1;
    }
    this.updateCurrentUser(this.currentUser);
    return this.currentUser;
  }

  resetLikeQuota() {
    this.currentUser.likeQuotaUsed = 0;
    this.currentUser.likeQuotaWindowStart = null;
    this.updateCurrentUser(this.currentUser);
  }

  getLikeQuotaStatus() {
    if (this.currentUser.entitlements?.plan === 'PLUS' || this.currentUser.entitlements?.plan === 'PRO') {
      return { used: 0, limit: '∞', resetsInHours: 0 };
    }
    
    const limit = this.currentUser.likeQuotaLimit ?? 20;
    const used = this.currentUser.likeQuotaUsed || 0;
    const windowStart = this.currentUser.likeQuotaWindowStart;
    
    let resetsInHours = 0;
    if (windowStart) {
      const now = Date.now();
      const elapsed = now - windowStart;
      const remaining = (24 * 60 * 60 * 1000) - elapsed;
      if (remaining > 0) {
        resetsInHours = Math.ceil(remaining / (60 * 60 * 1000));
      }
    }
    
    return { used, limit, resetsInHours };
  }

  swipeRight(user: User): User {
    // Add to Liked
    if (!this.liked.find(u => u.uid === user.uid)) {
      this.liked.push(user);
    }
    // Remove from Candidates
    this.candidates = this.candidates.filter(u => u.uid !== user.uid);
    
    // Simulate Match (30% chance or if they already liked you)
    const alreadyLikedMe = this.likesYou.find(u => u.uid === user.uid);
    if (!this.matches.find(u => u.uid === user.uid)) {
       if (alreadyLikedMe || Math.random() < 0.3) {
           this.matches.push(user);
           // Also add to newMatches for the top bar
           this.newMatches.push({ ...user, isInstaMsg: false });
           
           // Remove from Likes Me if they were there
           this.likesYou = this.likesYou.filter(u => u.uid !== user.uid);
           
           // Add to active conversations
           this.startChat(user, '', true);
           
           pushService.notify('NEW_MATCH', { userId: user.uid });
       }
    }
    return this.currentUser;
  }

  swipeLeft(user: User): User {
    // Add to Passed
    if (!this.passed.find(u => u.uid === user.uid)) {
      this.passed.push(user);
    }
    // Remove from Candidates
    this.candidates = this.candidates.filter(u => u.uid !== user.uid);
    return this.currentUser;
  }

  recoverPassedUser(userId: string): User | null {
    const userIndex = this.passed.findIndex(u => u.uid === userId);
    if (userIndex === -1) return null;
    
    const user = this.passed[userIndex];
    this.passed.splice(userIndex, 1);
    
    // Add back to candidates at the beginning
    if (!this.candidates.find(u => u.uid === userId)) {
      this.candidates.unshift(user);
    }
    
    return user;
  }

  startChat(user: User, initialMessage?: string, skipInitialMessage: boolean = false) {
    let chat = this.chats.find(c => c.user.uid === user.uid);
    if (!chat) {
      chat = {
        id: `chat-${user.uid}`,
        user: user,
        lastMessage: initialMessage || "Started a chat",
        time: 'Just now',
        unread: false,
        status: 'ACTIVE',
        messages: [],
        galleryAccess: {
          [this.currentUser.uid]: false,
          [user.uid]: false
        }
      };
      
      if (!skipInitialMessage) {
        if (initialMessage) {
          chat.messages.push({
            id: `msg-${Date.now()}`,
            senderId: this.currentUser.uid,
            text: initialMessage,
            timestamp: { toDate: () => new Date() },
            status: 'sent'
          } as any);
          pushService.notify('INSTANT_MESSAGE_RECEIVED', { chatId: chat.id, senderId: this.currentUser.uid });
        } else {
          // Add a mock message from the other user for demo purposes if no initial message
          chat.messages.push({
            id: `msg-${Date.now()}-mock`,
            senderId: user.uid,
            text: "Hey! How's it going?",
            timestamp: { toDate: () => new Date(Date.now() - 3600000) },
            status: 'read'
          } as any);
        }
      }
      
      this.chats.unshift(chat);
    } else if (initialMessage && !skipInitialMessage) {
      chat.lastMessage = initialMessage;
      chat.time = 'Just now';
      chat.messages = chat.messages || [];
      chat.messages.push({
        id: `msg-${Date.now()}`,
        senderId: this.currentUser.uid,
        text: initialMessage,
        timestamp: { toDate: () => new Date() },
        status: 'sent'
      } as any);
      pushService.notify('INSTANT_MESSAGE_RECEIVED', { chatId: chat.id, senderId: this.currentUser.uid });
    }
    return chat;
  }

  getChatMessages(chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    return chat?.messages || [];
  }

  appendPhotoMessage(chatId: string, photoUrl: string, expiryMode: '3s' | '10s' | '30s', senderId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages = chat.messages || [];
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        text: 'Disappearing photo',
        timestamp: { toDate: () => new Date() },
        status: 'ACTIVE',
        type: 'PHOTO',
        photoUrl,
        viewOnce: true,
        expiresAt: undefined,
        expiryMode, // Store the mode for timed expiry
        viewedBy: []
      } as any;
      chat.messages.push(newMessage);
      chat.lastMessage = 'Disappearing photo';
      chat.time = 'Just now';
      pushService.notify('NEW_MESSAGE', { chatId, senderId });
      return newMessage;
    }
    return null;
  }

  appendVoiceMessage(chatId: string, audioUrl: string, duration: number, senderId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages = chat.messages || [];
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        text: 'Voice message',
        timestamp: { toDate: () => new Date() },
        status: 'ACTIVE',
        type: 'VOICE',
        audioUrl,
        duration,
        viewedBy: []
      } as any;
      chat.messages.push(newMessage);
      chat.lastMessage = 'Voice message';
      chat.time = 'Just now';
      pushService.notify('NEW_MESSAGE', { chatId, senderId });
      return newMessage;
    }
    return null;
  }

  markPhotoViewed(chatId: string, messageId: string, viewerId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      const msg = chat.messages?.find(m => m.id === messageId);
      if (msg && msg.type === 'PHOTO' && msg.status === 'ACTIVE') {
        if (!msg.viewedBy) msg.viewedBy = [];
        if (!msg.viewedBy.includes(viewerId)) {
          msg.viewedBy.push(viewerId);
          
          if (msg.expiryMode === '3s') {
            msg.expiresAt = Date.now() + 3 * 1000;
          } else if (msg.expiryMode === '10s') {
            msg.expiresAt = Date.now() + 10 * 1000;
          } else if (msg.expiryMode === '30s') {
            msg.expiresAt = Date.now() + 30 * 1000;
          }
        }
        return msg;
      }
    }
    return null;
  }

  toggleGalleryAccess(chatId: string, targetUid: string, hasAccess: boolean) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.galleryAccess = chat.galleryAccess || {};
      chat.galleryAccess[targetUid] = hasAccess;
      
      // Add a system message
      this.appendSystemMessage(
        this.currentUser.uid, 
        targetUid, 
        hasAccess ? "Granted access to private photos" : "Revoked access to private photos"
      );
    }
  }

  appendMessage(chatId: string, text: string, senderId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages = chat.messages || [];
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        text,
        timestamp: { toDate: () => new Date() },
        status: 'sent'
      } as any;
      chat.messages.push(newMessage);
      chat.lastMessage = text;
      chat.time = 'Just now';
      pushService.notify('NEW_MESSAGE', { chatId, senderId });
      
      // Auto-reply for mock purposes
      if (senderId === this.currentUser.uid || senderId === 'current-user') {
        setTimeout(() => {
          const replyText = `That's interesting! Tell me more.`;
          const replyMessage = {
            id: `msg-${Date.now() + 1}`,
            senderId: chat.user.uid,
            text: replyText,
            timestamp: { toDate: () => new Date() },
            status: 'sent'
          } as any;
          chat.messages.push(replyMessage);
          chat.lastMessage = replyText;
          chat.time = 'Just now';
          chat.unread = true;
          pushService.notify('NEW_MESSAGE', { chatId, senderId: chat.user.uid });
        }, 2000);
      }
      
      return newMessage;
    }
    return null;
  }

  spendInstantMessageCredit(): boolean {
    return billingService.consumeInstantMessage();
  }

  addInstantMessages(count: number) {
    if (count === 1) billingService.purchase('com.thurzt.im.1');
    else if (count === 3) billingService.purchase('com.thurzt.im.3');
    else if (count === 5) billingService.purchase('com.thurzt.im.5');
  }

  async spendInstantMessageCreditAsync(): Promise<{success: boolean, user: User}> {
    if (CONFIG.DATA_MODE === 'firebase') {
      // In firebase mode, call the cloud function stub
      const success = await FirebaseFunctionsStubs.decrementCredits(this.currentUser.uid, 1, 'instant_message', `im_${Date.now()}`);
      return { success, user: this.currentUser };
    }
    const success = this.spendInstantMessageCredit();
    return { success, user: this.currentUser };
  }

  setCredits(amount: number) {
    if (amount === 1) billingService.purchase('com.thurzt.im.1');
    else if (amount === 3) billingService.purchase('com.thurzt.im.3');
    else if (amount === 5) billingService.purchase('com.thurzt.im.5');
  }

  addBoosts(type: '1h' | '12h' | '24h', amount: number) {
    if (type === '1h') billingService.purchase('boost_1h');
    else if (type === '12h') billingService.purchase('boost_12h');
    else if (type === '24h') billingService.purchase('boost_24h');
  }

  setPlan(plan: 'FREE' | 'PLUS' | 'PRO') {
    if (plan === 'PLUS') billingService.purchase('com.thurzt.plus.monthly');
    else if (plan === 'PRO') billingService.purchase('com.thurzt.pro.monthly');
    else {
      // For FREE, we just set the plan directly on the mock user since there's no "FREE" product
      if (this.currentUser.entitlements) {
        this.currentUser.entitlements.plan = 'FREE';
      }
      billingService.getEntitlements(); // Syncs it
      this.updateCurrentUser(this.currentUser);
    }
  }

  purchaseProduct(productId: string) {
    if (productId === 'FREE') {
      this.setPlan('FREE');
    } else {
      billingService.purchase(productId);
    }
  }

  resetMonthlyAllowance() {
    billingService.forceMonthlyReset();
  }

  restorePurchases() {
    billingService.restorePurchases();
  }

  // --- DEVELOPER SESSION SHORTCUTS ---
  simulateLikeLimitReached() {
    this.currentUser.likeQuotaUsed = this.currentUser.likeQuotaLimit ?? 20;
    this.currentUser.likeQuotaWindowStart = Date.now();
    this.updateCurrentUser(this.currentUser);
  }

  simulateNoIMCredits() {
    if (this.currentUser.entitlements) {
      this.currentUser.entitlements.imCredits = 0;
    }
    this.updateCurrentUser(this.currentUser);
  }

  simulateActiveBoost() {
    if (!this.currentUser.entitlements) {
      this.currentUser.entitlements = {
        plan: 'FREE',
        imCredits: 0,
        ghostMode: false,
        privatePhotos: false
      };
    }
    this.currentUser.entitlements.activeBoostUntil = Date.now() + 30 * 60 * 1000; // 30 mins
    this.updateCurrentUser(this.currentUser);
  }

  setSessionPreset(preset: 'FREE' | 'PLUS' | 'PRO') {
    // Reset to fresh state first
    this.currentUser.likeQuotaUsed = 0;
    this.currentUser.likeQuotaWindowStart = null;
    this.currentUser.visibilityMode = 'PUBLIC';
    
    // Clear entitlements
    this.currentUser.entitlements = {
      plan: preset,
      imCredits: preset === 'PRO' ? 5 : (preset === 'PLUS' ? 3 : 0),
      ghostMode: preset === 'PRO',
      privatePhotos: true
    };
    
    if (preset === 'PRO') {
      this.currentUser.visibilityMode = 'GHOST';
    }
    
    this.updateCurrentUser(this.currentUser);
  }

  async refreshEntitlementsAsync(): Promise<void> {
    if (CONFIG.DATA_MODE === 'firebase') {
      const entitlements = await FirebaseFunctionsStubs.getEntitlements(this.currentUser.uid);
      this.currentUser.entitlements = entitlements;
      this.updateCurrentUser(this.currentUser);
    } else {
      billingService.getEntitlements();
    }
  }
  
  toggleSeedChats(enable: boolean) {
      if (enable) {
          // Seed demo matches and chats
          this.newMatches = JSON.parse(JSON.stringify(INITIAL_DEMO_MATCHES));
          this.matches = this.newMatches.map(u => u as User);
          
          // Requirement 5: Ensure seeded participants are excluded from candidates
          const seededIds = new Set(this.matches.map(u => u.uid));
          this.candidates = this.candidates.filter(u => !seededIds.has(u.uid));

          // Use the generated INITIAL_CHATS
          this.chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
      } else {
          this.chats = [];
          this.matches = [];
          this.newMatches = [];
      }
  }

  toggleGhostMode(userId: string) {
    const user = userId === this.currentUser.uid ? this.currentUser : this.candidates.find(c => c.uid === userId);
    if (!user) return;

    // For groups (3+), Ghost Mode can only be enabled if ALL members are Plus/Pro (mock entitlement check is fine).
    if (user.members && user.members.length >= 3) {
      const canGhostMode = user.entitlements?.ghostMode;
      if (!canGhostMode) {
        alert("Ghost Mode for groups of 3+ requires Plus/Pro plan.");
        return;
      }
    }

    user.visibilityMode = user.visibilityMode === 'GHOST' ? 'PUBLIC' : 'GHOST';
  }

  getSeedHighlights() {
    return {
      totalEntities: this.candidates.length + this.likesYou.length + this.matches.length + this.passed.length,
      privateGalleries: this.candidates.filter(c => c.privateGallery).map(c => c.uid),
      ghosted: this.candidates.filter(c => c.visibilityMode === 'GHOST').map(c => c.uid),
      couples: this.candidates.filter(c => c.members.length === 2).map(c => c.uid),
      groups: this.candidates.filter(c => c.members.length > 2).map(c => c.uid),
    };
  }

  simulateCandidateLikedViewerFirst(candidateId: string) {
    const candidate = this.candidates.find(c => c.uid === candidateId);
    if (!candidate) return;
    
    // Add to likesYou array so they appear in the Likes Me tab
    const alreadyLiked = this.likesYou.find(u => u.uid === candidateId);
    if (!alreadyLiked) {
      this.likesYou.push(candidate);
    } else {
      this.likesYou = this.likesYou.filter(u => u.uid !== candidateId);
    }

    // Explicitly add the viewer to the candidate's visibleToIds
    candidate.visibleToIds = candidate.visibleToIds || [];
    const viewerId = this.currentUser.uid;
    if (candidate.visibleToIds.includes(viewerId)) {
      candidate.visibleToIds = candidate.visibleToIds.filter(id => id !== viewerId);
    } else {
      candidate.visibleToIds.push(viewerId);
    }
  }

  seedProfiles(count: number) {
    const newProfiles = JSON.parse(JSON.stringify(INITIAL_CANDIDATES)).slice(0, count).map((p: User, i: number) => ({
      ...p,
      uid: `seeded-${Date.now()}-${i}`
    }));
    this.candidates = [...this.candidates, ...newProfiles];
  }

  factoryReset() {
    localStorage.clear();
    this.currentUser = JSON.parse(JSON.stringify(INITIAL_CURRENT_USER));
    this.candidates = JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
    this.likesYou = JSON.parse(JSON.stringify(INITIAL_LIKES_YOU));
    this.liked = [];
    this.passed = [];
    this.matches = [];
    this.newMatches = [];
    this.chats = [];
  }
}

export const MockService = new MockServiceClass();

// --- BACKWARDS COMPATIBILITY EXPORTS (Deprecate these over time) ---
// These are now getters to ensure they always reflect current state
export const MOCK_CURRENT_USER = MockService.getCurrentUser();
// Note: Arrays exported as consts won't update if we re-assign the property in the class.
// But since we mutate the arrays in the class (mostly), it might work if we export the reference.
// However, swipeRight filters the array (creates new reference).
// So direct imports of MOCK_CANDIDATES will become stale.
// WE MUST UPDATE CONSUMERS TO USE MockService.getCandidates().

export const spendInstantMessageCredit = () => MockService.spendInstantMessageCredit();

