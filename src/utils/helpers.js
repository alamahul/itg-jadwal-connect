export const convertTimeToMinutes = (timeStr) => {
  // Replace . with : to handle various formats like 14.40 or 14:40
  const normalizedTime = timeStr.replace('.', ':');
  const [hours, minutes] = normalizedTime.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

export const checkConflict = (classA, classB) => {
  if (classA.day !== classB.day) return false;

  const startA = convertTimeToMinutes(classA.startTime);
  const endA = convertTimeToMinutes(classA.endTime);
  const startB = convertTimeToMinutes(classB.startTime);
  const endB = convertTimeToMinutes(classB.endTime);

  return (startA < endB && startB < endA);
};

export const notify = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/vite.svg' });
  }
};
