import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../constants/role';

export const Roles = (...roles: ROLE[]) => SetMetadata('role', roles);
