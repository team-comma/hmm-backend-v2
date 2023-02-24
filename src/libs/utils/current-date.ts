export const currentDate = () => {
  const date = new Date();
  return Intl.DateTimeFormat('ko', { dateStyle: 'full' }).format(date);
};
