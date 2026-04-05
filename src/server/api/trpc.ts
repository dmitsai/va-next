import { Roles } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { httpClient } from "~/shared/api/client";
import { Session } from "next-auth";
import { NextRequest } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "../db/db";

type CreateContextOptions = {
  headers: Headers;
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => ({
  prisma,
  session: opts.session,
  http: httpClient,
  headers: opts.headers,
});

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const session = await getServerAuthSession();

  return createInnerTRPCContext({
    headers: opts.req.headers,
    session,
  });
};

export const createSSRContext = async (opts?: { headers?: Headers }) => {
  const session = await getServerAuthSession();

  return createInnerTRPCContext({
    headers: opts?.headers ?? new Headers(),
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.session.user.role !== Roles.ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);

const enforceUserIsCompany = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.session.user.role !== Roles.COMPANY) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  console.log("USER_ID", ctx.session.user.id);

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const companyProcedure = t.procedure.use(enforceUserIsCompany);
