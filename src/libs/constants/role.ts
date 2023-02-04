export const ROLE = {
  OUTSIDER: '외부인',
  USER: '유저',
  ADMIN: '관리자',
  STUDENT_COUNCIL: '학생회',
  STUDENT_COUNCIL_OFFICER: '학생회임원',
  BROADCASTING_DEPARTMENT: '방송부',
  BROADCASTING_DEPARTMENT_DIRECTOR: '방송부장',
} as const;
export type ROLE = typeof ROLE[keyof typeof ROLE];
