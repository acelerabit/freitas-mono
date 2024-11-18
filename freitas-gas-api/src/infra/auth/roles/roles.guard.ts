import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    const userFound = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!user) {
      return false;
    }

    if (requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.includes(userFound.role);
  }
}
