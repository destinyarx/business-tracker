import * as z from 'zod';

export const expensesSchema = z.object({
    title: z.string().min(1, 'Expense name is required').max(50),
    description: z.string().optional(),
    dateIncurred: z.date(),
    amount: z.number().gt(0, 'Amount must be greater than 0'),
    referenceNumber: z.string().optional(),
    category: z.string().max(20),
    categoryOther: z.string().max(30).optional(),
    paymentMethod: z.string().max(20),
    paymentMethodOther: z.string().max(30).optional(),
});

export type ExpensesSchema = z.infer<typeof expensesSchema>

export const expenseResponseSchema = z.object({
    id: z.number().int().positive(),
    title: z.string(),
    description: z.string().nullish().transform((description) => description ?? undefined),
    dateIncurred: z.coerce.date(),
    amount: z.coerce.number(),
    referenceNumber: z.string().nullish().transform((referenceNumber) => referenceNumber ?? undefined),
    category: z.string(),
    categoryOther: z.string().nullish().transform((categoryOther) => categoryOther ?? undefined),
    paymentMethod: z.string(),
    paymentMethodOther: z.string().nullish().transform((paymentMethodOther) => paymentMethodOther ?? undefined),
    createdAt: z.coerce.date().optional(),
})

export const paginatedExpensesResponseSchema = z.object({
    data: z.object({
        results: z.array(expenseResponseSchema),
        hasNext: z.boolean(),
        hasPrev: z.boolean().optional(),
    }),
})
