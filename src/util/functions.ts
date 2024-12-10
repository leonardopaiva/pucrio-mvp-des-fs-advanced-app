// Function to generate a unique ID (UUID) for the appointment
export const generateUniqueId = (): string => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
