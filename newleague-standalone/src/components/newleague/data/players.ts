/**
 * SAMPLE player data.
 *
 * All names, profiles and statistics below are fictional placeholders and are
 * not associated with any real athlete. Each team has exactly one player
 * flagged as `isMvp`; the team's featured MVP is derived from this flag.
 */

export type PlayerCategory =
  | "Men's singles"
  | "Women's singles"
  | "Men's doubles"
  | "Women's doubles"
  | 'Mixed doubles';

export const playerCategories: PlayerCategory[] = [
  "Men's singles",
  "Women's singles",
  "Men's doubles",
  "Women's doubles",
  'Mixed doubles',
];

export interface PlayerStats {
  /** Sample: rubbers played this season. */
  matchesPlayed: number;
  /** Sample: rubbers won this season. */
  wins: number;
  /** Sample: rally points won this season. */
  pointsWon: number;
  /** Sample: 0–100 performance index used for the demo leaderboard. */
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  category: PlayerCategory;
  isMvp: boolean;
  bio: string;
  stats: PlayerStats;
}

type Row = [
  id: string,
  name: string,
  teamId: string,
  category: PlayerCategory,
  isMvp: boolean,
  bio: string,
  stats: [played: number, wins: number, points: number, rating: number]
];

const rows: Row[] = [
  // Thunder Smashers
  [
    'p-kiran-bhat',
    'Kiran Bhat',
    'thunder-smashers',
    "Men's singles",
    true,
    'Left-handed attacker with a punishing cross-court smash.',
    [3, 3, 189, 91],
  ],
  [
    'p-ananya-rao',
    'Ananya Rao',
    'thunder-smashers',
    "Women's singles",
    false,
    'Quick around the court and hard to pass on the backhand side.',
    [3, 1, 162, 74],
  ],
  [
    'p-rohit-nair',
    'Rohit Nair',
    'thunder-smashers',
    "Men's doubles",
    false,
    'Back-court specialist who keeps the pressure on with repeated smashes.',
    [3, 1, 170, 72],
  ],
  [
    'p-divya-hegde',
    'Divya Hegde',
    'thunder-smashers',
    "Women's doubles",
    false,
    'Sharp at the net, rarely gives away a loose lift.',
    [2, 1, 108, 70],
  ],
  [
    'p-suraj-patil',
    'Suraj Patil',
    'thunder-smashers',
    'Mixed doubles',
    false,
    'Covers the rear court so his partner can hunt at the net.',
    [3, 1, 158, 71],
  ],
  // Royal Racquets
  [
    'p-aditya-menon',
    'Aditya Menon',
    'royal-racquets',
    "Men's singles",
    false,
    'Patient rally builder with excellent length on his clears.',
    [3, 2, 176, 80],
  ],
  [
    'p-meghana-iyer',
    'Meghana Iyer',
    'royal-racquets',
    "Women's singles",
    true,
    'Deceptive holds and a calm head in deciding games.',
    [3, 3, 181, 92],
  ],
  [
    'p-varun-joshi',
    'Varun Joshi',
    'royal-racquets',
    "Men's doubles",
    false,
    'Strong defender who turns defence into attack quickly.',
    [3, 2, 165, 78],
  ],
  [
    'p-sneha-kulkarni',
    'Sneha Kulkarni',
    'royal-racquets',
    "Women's doubles",
    false,
    'Reliable server with tight, low serves under pressure.',
    [3, 1, 150, 69],
  ],
  [
    'p-nikhil-desai',
    'Nikhil Desai',
    'royal-racquets',
    'Mixed doubles',
    false,
    'Flat drives and quick interceptions from mid-court.',
    [2, 1, 112, 73],
  ],
  // Blaze Warriors
  [
    'p-harsha-murthy',
    'Harsha Murthy',
    'blaze-warriors',
    "Men's singles",
    false,
    'Explosive first step and an aggressive return of serve.',
    [3, 2, 171, 81],
  ],
  [
    'p-pooja-shenoy',
    'Pooja Shenoy',
    'blaze-warriors',
    "Women's singles",
    false,
    'Likes to push the pace with flat drives down the line.',
    [3, 2, 166, 79],
  ],
  [
    'p-tarun-prasad',
    'Tarun Prasad',
    'blaze-warriors',
    "Men's doubles",
    true,
    'Fastest hands on the roster in front-court exchanges.',
    [3, 3, 184, 90],
  ],
  [
    'p-keerthi-naik',
    'Keerthi Naik',
    'blaze-warriors',
    "Women's doubles",
    false,
    'Steady rotation and smart placement off the smash.',
    [3, 1, 147, 70],
  ],
  [
    'p-abhay-gowda',
    'Abhay Gowda',
    'blaze-warriors',
    'Mixed doubles',
    false,
    'Powerful jump smash from the back of the court.',
    [2, 1, 104, 72],
  ],
  // Net Ninjas
  [
    'p-yash-pillai',
    'Yash Pillai',
    'net-ninjas',
    "Men's singles",
    true,
    'Wristy net player who disguises every shot until the last moment.',
    [3, 2, 177, 88],
  ],
  [
    'p-ritika-sharma',
    'Ritika Sharma',
    'net-ninjas',
    "Women's singles",
    false,
    'Consistent all-court player with great footwork.',
    [3, 1, 155, 73],
  ],
  [
    'p-manish-rao',
    'Manish Rao',
    'net-ninjas',
    "Men's doubles",
    false,
    'Calm under the high serve and strong in long rallies.',
    [3, 1, 149, 68],
  ],
  [
    'p-lavanya-reddy',
    'Lavanya Reddy',
    'net-ninjas',
    "Women's doubles",
    false,
    'Net kills and tight spinning net shots.',
    [3, 1, 152, 71],
  ],
  [
    'p-siddharth-kamath',
    'Siddharth Kamath',
    'net-ninjas',
    'Mixed doubles',
    false,
    'Covers the full rear court with long, easy strides.',
    [2, 0, 96, 64],
  ],
  // Golden Falcons
  [
    'p-chetan-acharya',
    'Chetan Acharya',
    'golden-falcons',
    "Men's singles",
    false,
    'Tall and rangy, with a steep jump smash.',
    [3, 2, 170, 79],
  ],
  [
    'p-bhavana-shetty',
    'Bhavana Shetty',
    'golden-falcons',
    "Women's singles",
    true,
    'Relentless retriever who rarely loses a long rally.',
    [3, 3, 186, 93],
  ],
  [
    'p-gautam-pai',
    'Gautam Pai',
    'golden-falcons',
    "Men's doubles",
    false,
    'Strong defensive wall with a quick counter-drive.',
    [3, 2, 163, 77],
  ],
  [
    'p-nandini-bhat',
    'Nandini Bhat',
    'golden-falcons',
    "Women's doubles",
    false,
    'Precise flick serve and alert at the front.',
    [3, 1, 151, 70],
  ],
  [
    'p-rakesh-hegde',
    'Rakesh Hegde',
    'golden-falcons',
    'Mixed doubles',
    false,
    'Hits hard from the back and recovers quickly.',
    [3, 2, 160, 76],
  ],
  // Storm Breakers
  [
    'p-vivek-narayan',
    'Vivek Narayan',
    'storm-breakers',
    "Men's singles",
    false,
    'Endurance player who wins the third game more often than not.',
    [3, 2, 174, 78],
  ],
  [
    'p-shruti-menon',
    'Shruti Menon',
    'storm-breakers',
    "Women's singles",
    false,
    'Sharp drop shots and a deceptive slice.',
    [3, 1, 158, 72],
  ],
  [
    'p-akash-kumar',
    'Akash Kumar',
    'storm-breakers',
    "Men's doubles",
    false,
    'Strong rear-court attacker with a heavy smash.',
    [3, 1, 154, 70],
  ],
  [
    'p-priya-nair',
    'Priya Nair',
    'storm-breakers',
    "Women's doubles",
    false,
    'Good court sense and an excellent defensive block.',
    [2, 1, 110, 71],
  ],
  [
    'p-karthik-rao',
    'Karthik Rao',
    'storm-breakers',
    'Mixed doubles',
    true,
    'Reads the play early and wins the mid-court battle.',
    [3, 3, 180, 89],
  ],
  // Shadow Strikers
  [
    'p-dhruv-shetty',
    'Dhruv Shetty',
    'shadow-strikers',
    "Men's singles",
    true,
    'Master of the late hold and reverse slice.',
    [3, 2, 172, 86],
  ],
  [
    'p-isha-kulkarni',
    'Isha Kulkarni',
    'shadow-strikers',
    "Women's singles",
    false,
    'Fast feet and a sharp, flat clear.',
    [3, 1, 150, 69],
  ],
  [
    'p-sameer-iyer',
    'Sameer Iyer',
    'shadow-strikers',
    "Men's doubles",
    false,
    'Quick interceptions from the front of the court.',
    [3, 1, 148, 68],
  ],
  [
    'p-anjali-prasad',
    'Anjali Prasad',
    'shadow-strikers',
    "Women's doubles",
    false,
    'Smooth rotations and precise lifts to the corners.',
    [3, 0, 132, 63],
  ],
  [
    'p-mohit-gowda',
    'Mohit Gowda',
    'shadow-strikers',
    'Mixed doubles',
    false,
    'Hard-hitting partner who likes to take the shuttle early.',
    [2, 1, 101, 69],
  ],
  // Elite Smashers
  [
    'p-arvind-reddy',
    'Arvind Reddy',
    'elite-smashers',
    "Men's singles",
    false,
    'Technically clean with a dependable backhand clear.',
    [3, 2, 169, 80],
  ],
  [
    'p-kavya-murthy',
    'Kavya Murthy',
    'elite-smashers',
    "Women's singles",
    true,
    'Composed finisher with a habit of saving game points.',
    [3, 3, 183, 91],
  ],
  [
    'p-pranay-joshi',
    'Pranay Joshi',
    'elite-smashers',
    "Men's doubles",
    false,
    'Explosive at the net and quick to finish rallies.',
    [3, 2, 161, 77],
  ],
  [
    'p-swathi-rao',
    'Swathi Rao',
    'elite-smashers',
    "Women's doubles",
    false,
    'Strong defender with long reach.',
    [3, 1, 146, 70],
  ],
  [
    'p-rajat-naik',
    'Rajat Naik',
    'elite-smashers',
    'Mixed doubles',
    false,
    'Clean serve-and-attack pattern in mixed doubles.',
    [3, 2, 159, 76],
  ],
];

export const players: Player[] = rows.map(
  ([
    id,
    name,
    teamId,
    category,
    isMvp,
    bio,
    [matchesPlayed, wins, pointsWon, rating],
  ]) => ({
    id,
    name,
    teamId,
    category,
    isMvp,
    bio,
    stats: { matchesPlayed, wins, pointsWon, rating },
  })
);
