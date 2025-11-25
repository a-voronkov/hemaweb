/**
 * Calculate walking time based on distance
 * Average walking speed: 5 km/h (healthy adult)
 */
export function calculateWalkingTime(distanceKm: number): string {
  const WALKING_SPEED_KM_PER_HOUR = 5;
  const hours = distanceKm / WALKING_SPEED_KM_PER_HOUR;
  const minutes = Math.round(hours * 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} walk`;
  }

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hrs} hour${hrs !== 1 ? 's' : ''} walk`;
  }

  return `${hrs} hour${hrs !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''} walk`;
}

/**
 * Format radius label with distance and walking time
 */
export function formatRadiusLabel(radiusKm: number): string {
  const walkingTime = calculateWalkingTime(radiusKm);
  return `${radiusKm} km, ${walkingTime}`;
}

