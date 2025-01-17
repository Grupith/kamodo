/**
 * Calculates the progress of a job based on its start and end dates.
 *
 * @param {number | null} startDate - The start date of the job in milliseconds.
 * @param {number | null} endDate - The end date of the job in milliseconds.
 * @returns {Object} - An object containing the progress percentage, days elapsed, and days left.
 */
export const calculateJobProgress = (
  startDate: number | null,
  endDate: number | null
): {
  progressPercentage: number;
  elapsedDays: number;
  daysLeft: number;
} => {
  if (!startDate || !endDate || startDate >= endDate) {
    return {
      progressPercentage: 0,
      elapsedDays: 0,
      daysLeft: 0,
    };
  }

  const now = Date.now();
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Total job duration in days
  const elapsedDays = Math.max(
    0,
    Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
  ); // Days elapsed since start
  const daysLeft = Math.max(0, totalDays - elapsedDays); // Days remaining until the end date

  const progressPercentage = Math.min(
    100,
    Math.max(0, (elapsedDays / totalDays) * 100) // Calculate progress as a percentage
  );

  return {
    progressPercentage,
    elapsedDays,
    daysLeft,
  };
};
