import { CurrencySchema } from '~/shared/api/schema/currency';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const currencyRouter = createTRPCRouter({
    getAllCurrencies: publicProcedure.query(async ({ ctx }) => {
        const currencies =
            (await ctx.prisma.currency.findMany()) as CurrencySchema[];

        return currencies;
    }),
});
