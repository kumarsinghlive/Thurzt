export const GeoQueryHelper = {
  encodeGeohash: (lat: number, lng: number): string => {
    // Simple mock geohash encoder
    return 'mock_geohash';
  },
  filterByDistanceFirebase: (candidates: any[], lat: number, lng: number, maxDistance: number) => {
    return candidates;
  }
};
