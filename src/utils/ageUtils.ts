/**
 * Utility functions for age calculations and grouping
 */

/**
 * Calculate age from birth date
 * @param birthDate Birth date string in format YYYY-MM-DD
 * @returns Age in years
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Group ages into predefined ranges
 * @param users Array of users with birthDate property
 * @returns Object with age groups and counts
 */
export function getAgeDistribution(users: { birthDate?: string }[]): { [key: string]: number } {
  // Define age groups
  const ageGroups: { [key: string]: number } = {
    "< 18": 0,
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55+": 0
  };
  
  // Count users in each age group
  users.forEach(user => {
    if (!user.birthDate) return;
    
    const age = calculateAge(user.birthDate);
    
    if (age < 18) {
      ageGroups["< 18"]++;
    } else if (age >= 18 && age <= 24) {
      ageGroups["18-24"]++;
    } else if (age >= 25 && age <= 34) {
      ageGroups["25-34"]++;
    } else if (age >= 35 && age <= 44) {
      ageGroups["35-44"]++;
    } else if (age >= 45 && age <= 54) {
      ageGroups["45-54"]++;
    } else {
      ageGroups["55+"]++;
    }
  });
  
  return ageGroups;
}
