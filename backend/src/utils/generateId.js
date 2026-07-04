/**
 * Generates a unique complaint ID in the format: CMP-YYYYMMDD-XXXX
 * where XXXX is a random 4-digit alphanumeric string.
 */
export const generateComplaintId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `CMP-${year}${month}${day}-${random}`;
};

/**
 * Generates a unique notification ID.
 */
export const generateNotificationId = () => {
  return `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};
