import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtUserAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata('roles', role),
    UseGuards(JwtUserAuthGuard, RolesGuard),
  );
}
