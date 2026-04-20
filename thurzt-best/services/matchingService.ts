
import { User, UserPreferences } from "../types";
import { MockService, INITIAL_CANDIDATES } from "./mockData";
import { CONFIG } from "../config";

export const MatchingService = {
  /**
   * Generates the matching stack based on user filters.
   */
  getSmartStack: async (userPrefs: UserPreferences, currentUser: User): Promise<User[]> => {
    // console.log("[MatchingService] Querying stack for filters:", userPrefs);

    if (CONFIG.DATA_MODE === 'mock') {
      return JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
    }

    let baseCandidates = MockService.getCandidates();

    let potentialMatches = baseCandidates.filter(candidate => {
      // Status Check (assume true for mock candidates if undefined)
      if (candidate.onboardingComplete === false) return false;

      // Age Gate
      if (candidate.age < userPrefs.ageRange[0] || candidate.age > userPrefs.ageRange[1]) return false;

      // Distance
      const dist = candidate.distance || 0;
      if (dist > userPrefs.maxDistance) return false;

      // Gender/Couple Logic
      if (userPrefs.lookingFor && userPrefs.lookingFor.length > 0) {
        let typeMatch = false;
        if (userPrefs.lookingFor.includes('Singles') && candidate.type === 'single') typeMatch = true;
        if (userPrefs.lookingFor.includes('Couples') && candidate.type === 'couple') typeMatch = true;
        if (userPrefs.lookingFor.includes('Groups') && candidate.type === 'group') typeMatch = true;
        if (!typeMatch) return false;
      }

      // If Looking For: Singles -> Match genderIdentity
      if (candidate.type === 'single' && userPrefs.gendersOpenTo && userPrefs.gendersOpenTo.length > 0) {
        const g = candidate.members?.[0]?.genderIdentity;
        if (!g || !userPrefs.gendersOpenTo.includes(g)) return false;
      }

      // If Looking For: Couples -> Match coupleType
      if (candidate.type === 'couple' && userPrefs.coupleType && userPrefs.coupleType.length > 0) {
        const hasAnyCouple = userPrefs.coupleType.includes('Any couple');
        if (!hasAnyCouple) {
          if (!candidate.coupleType || !userPrefs.coupleType.includes(candidate.coupleType)) return false;
        }
      }

      // Heritage: Filter by array overlap (array-contains-any)
      if (userPrefs.heritage && userPrefs.heritage.length > 0) {
        const hasSharedHeritage = candidate.heritage?.some(h => userPrefs.heritage!.includes(h)) ||
          candidate.members?.some(m => m.heritage?.some(h => userPrefs.heritage!.includes(h)));
        if (!hasSharedHeritage) return false;
      }

      // Dynamics: Filter by array overlap
      if (userPrefs.dynamics && userPrefs.dynamics.length > 0) {
        const hasSharedDynamics = candidate.members?.some(m => m.dynamics?.some(d => userPrefs.dynamics!.includes(d)));
        if (!hasSharedDynamics) return false;
      }

      // Interests: Filter by array overlap
      if (userPrefs.interests && userPrefs.interests.length > 0) {
        const hasSharedInterests = candidate.members?.some(m => m.interests?.some(i => userPrefs.interests!.includes(i)));
        if (!hasSharedInterests) return false;
      }

      return true;
    });

    // Sort by shared goals as a soft ranking, or just return
    return potentialMatches.sort((a, b) => {
      let scoreA = a.goals.filter(g => currentUser.goals.includes(g)).length;
      let scoreB = b.goals.filter(g => currentUser.goals.includes(g)).length;
      return scoreB - scoreA;
    });
  }
};
