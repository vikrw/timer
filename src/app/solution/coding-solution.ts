type Range = { min: number; max: number };
type Camera = { distance: Range; light: Range };

/**
 * Validates if the software camera requirements are met by the hardware.
 */
function validateCameraCoverage(
  targetDist: Range,
  targetLight: Range,
  hardware: Camera[]
): boolean {
  // 1. Collect all unique distance boundaries that fall within our target range
  const boundaries = new Set<number>();
  boundaries.add(targetDist.min);
  boundaries.add(targetDist.max);

  for (const cam of hardware) {
    if (cam.distance.min > targetDist.min && cam.distance.min < targetDist.max) 
        boundaries.add(cam.distance.min);
    if (cam.distance.max > targetDist.min && cam.distance.max < targetDist.max) 
        boundaries.add(cam.distance.max);
  }

  // Sort boundaries to create sequential "slices"
  const sortedPoints = Array.from(boundaries).sort((a, b) => a - b);

  // 2. Check every vertical slice created by these boundaries
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const leftEdge = sortedPoints[i];
    const rightEdge = sortedPoints[i + 1];
    
    // We test the midpoint of the slice to see which cameras are active here
    const midDistance = (leftEdge + rightEdge) / 2;
    
    // Get light ranges of all cameras that cover this distance slice
    const activeLightRanges = hardware
      .filter(c => c.distance.min <= leftEdge && c.distance.max >= rightEdge)
      .map(c => c.light);

    // 3. Verify if these combined light ranges cover the required light span
    if (!is1DCovered(targetLight, activeLightRanges)) {
      return false; // Found a hole in the coverage!
    }
  }

  return true;
}

/**
 * Standard 1D Interval Merging algorithm
 * Checks if a target range is covered by a set of fragments.
 */
function is1DCovered(target: Range, fragments: Range[]): boolean {
  // Sort fragments by start point to process them left-to-right
  const sorted = fragments.slice().sort((a, b) => a.min - b.min);
  
  let currentMaxReach = target.min;

  for (const frag of sorted) {
    if (frag.min > currentMaxReach) break; // Gap found
    if (frag.max > currentMaxReach) {
      currentMaxReach = frag.max;
    }
    if (currentMaxReach >= target.max) return true; // Fully covered
  }

  return currentMaxReach >= target.max;
}
