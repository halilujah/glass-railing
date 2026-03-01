import type { BaseShoeProfile } from '../types';

export const BASE_SHOE_PROFILES: BaseShoeProfile[] = [
  {
    id: 'tk8200-standard',
    name: 'TK8200 Standard',
    channelDepth: 100,
    flangeWidth: 65,
    compatibleThicknesses: [10, 12],
  },
  {
    id: 'tk8200-slim',
    name: 'TK8200 Slim',
    channelDepth: 80,
    flangeWidth: 50,
    compatibleThicknesses: [10],
  },
  {
    id: 'tk8200-heavy',
    name: 'TK8200 Heavy',
    channelDepth: 120,
    flangeWidth: 75,
    compatibleThicknesses: [12, 15],
  },
];
