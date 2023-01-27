export const checkIsStudent = (birthyear: number) => {
  const date = new Date().getFullYear();
  const student = [16, 17, 18];
  return student.includes(date - birthyear);
};
