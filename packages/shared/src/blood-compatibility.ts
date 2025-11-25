/**
 * Blood Type Compatibility System
 * 
 * Handles compatibility rules for:
 * - Whole blood (red blood cells)
 * - Plasma
 * - Platelets
 * - Double red cells (Power Red)
 */

export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type DonationType = 
  | 'whole_blood'      // Цельная кровь
  | 'plasma'           // Плазма
  | 'platelets'        // Тромбоциты
  | 'double_red_cells' // Двойные эритроциты (Power Red)
  | 'granulocytes';    // Гранулоциты

/**
 * Whole Blood / Red Blood Cells Compatibility
 * Donor → Recipients
 */
const WHOLE_BLOOD_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

/**
 * Plasma Compatibility (reverse logic)
 * Donor → Recipients
 */
const PLASMA_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal plasma donor
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

/**
 * Platelets Compatibility (similar to plasma)
 */
const PLATELETS_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

/**
 * Get compatible recipient blood types for a donor
 */
export function getCompatibleRecipients(
  donorBloodType: BloodType,
  donationType: DonationType
): BloodType[] {
  switch (donationType) {
    case 'whole_blood':
    case 'double_red_cells':
      return WHOLE_BLOOD_COMPATIBILITY[donorBloodType] || [];
    case 'plasma':
      return PLASMA_COMPATIBILITY[donorBloodType] || [];
    case 'platelets':
      return PLATELETS_COMPATIBILITY[donorBloodType] || [];
    case 'granulocytes':
      // Granulocytes typically follow whole blood rules
      return WHOLE_BLOOD_COMPATIBILITY[donorBloodType] || [];
    default:
      return [];
  }
}

/**
 * Get compatible donor blood types for a recipient
 */
export function getCompatibleDonors(
  recipientBloodType: BloodType,
  donationType: DonationType
): BloodType[] {
  const compatibilityMap = 
    donationType === 'plasma' || donationType === 'platelets'
      ? PLASMA_COMPATIBILITY
      : WHOLE_BLOOD_COMPATIBILITY;

  const donors: BloodType[] = [];
  
  for (const [donorType, recipients] of Object.entries(compatibilityMap)) {
    if (recipients.includes(recipientBloodType)) {
      donors.push(donorType as BloodType);
    }
  }
  
  return donors;
}

/**
 * Check if donor can donate to recipient
 */
export function isCompatible(
  donorBloodType: BloodType,
  recipientBloodType: BloodType,
  donationType: DonationType
): boolean {
  const compatibleRecipients = getCompatibleRecipients(donorBloodType, donationType);
  return compatibleRecipients.includes(recipientBloodType);
}

/**
 * Get priority level for blood type match
 * 0 = exact match, 1 = compatible, 2 = universal donor
 */
export function getMatchPriority(
  donorBloodType: BloodType,
  neededBloodType: BloodType,
  donationType: DonationType
): number {
  if (donorBloodType === neededBloodType) {
    return 0; // Exact match
  }
  
  if (isCompatible(donorBloodType, neededBloodType, donationType)) {
    // Check if universal donor
    const isUniversal = 
      (donationType === 'whole_blood' && donorBloodType === 'O-') ||
      (donationType === 'plasma' && donorBloodType === 'AB+');
    
    return isUniversal ? 2 : 1;
  }
  
  return -1; // Not compatible
}

/**
 * Get all blood types sorted by compatibility priority
 */
export function getBloodTypesByPriority(
  neededBloodType: BloodType,
  donationType: DonationType
): Array<{ bloodType: BloodType; priority: number; label: string }> {
  const allBloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  
  return allBloodTypes
    .map(bloodType => ({
      bloodType,
      priority: getMatchPriority(bloodType, neededBloodType, donationType),
      label: getPriorityLabel(getMatchPriority(bloodType, neededBloodType, donationType)),
    }))
    .filter(item => item.priority >= 0)
    .sort((a, b) => a.priority - b.priority);
}

function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 0: return 'Exact match';
    case 1: return 'Compatible';
    case 2: return 'Universal donor';
    default: return '';
  }
}

