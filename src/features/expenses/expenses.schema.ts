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
