export const STUDENT_DEPARTMENT = {
  METAVERSE_GAME: '메타버스게임과',
  CLOUDE_SECURITY: '클라우드보안과',
  NETWORK_SECURITY: '네트워크보안과',
  HACKING_SECURITY: '해킹보안과',
  GAME: '게임과',
  ETC: '기타',
} as const;
export type STUDENT_DEPARTMENT = typeof STUDENT_DEPARTMENT[keyof typeof STUDENT_DEPARTMENT];
