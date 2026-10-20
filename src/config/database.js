import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Singleton do Prisma Client.
 *
 * O banco é configurado por `DATABASE_URL` (SQLite) — veja `.env.example`.
 * Em desenvolvimento, a instância é reaproveitada via `globalThis` para evitar
 * abrir várias conexões durante hot-reload; em produção, cria-se uma única
 * instância por processo.
 */
export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
