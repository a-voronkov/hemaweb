import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { PrismaClient } from '@prisma/client';

// Initialize Prisma adapter for Lucia
function createLuciaAdapter(prisma: PrismaClient) {
  return new PrismaAdapter(prisma.session, prisma.user);
}

// Create Lucia instance
export function createLucia(prisma: PrismaClient) {
  const adapter = createLuciaAdapter(prisma);

  return new Lucia(adapter, {
    sessionCookie: {
      name: 'session',
      expires: false, // Session cookies
      attributes: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        roleId: attributes.roleId,
        isActive: attributes.isActive,
        isVerified: attributes.isVerified,
      };
    },
  });
}

// Type declarations for Lucia
declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof createLucia>;
    DatabaseUserAttributes: {
      email: string;
      roleId: string;
      isActive: boolean;
      isVerified: boolean;
    };
  }
}
