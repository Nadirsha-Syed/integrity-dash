export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const options = { month: 'short', day: 'numeric' };
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // If it's today, just show time
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${time}`;
  }
  
  return `${date.toLocaleDateString(undefined, options)} • ${time}`;
};