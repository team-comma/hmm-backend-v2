import { Member } from 'src/entities';

declare global {
  namespace Express {
    export interface User extends Member {
      user?: Member;
    }
  }
}
