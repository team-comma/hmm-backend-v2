export const checkIsStudent = (birthyear: string) => {
  const date = new Date().getFullYear();
  const student = [16, 17, 18, 19];
  return student.includes(date - parseInt(birthyear));
};
