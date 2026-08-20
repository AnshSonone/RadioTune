const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  // Pad with a leading zero if seconds are less than 10
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export {formatDuration}