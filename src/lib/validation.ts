import { z } from "zod";

export const categories = ["Home", "Food", "Transport", "Wellbeing", "Fun", "Other"] as const;

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount greater than zero.").max(1_000_000),
  category: z.enum(categories),
  date: z.string().date("Enter a valid date."),
  note: z.string().trim().max(120, "Keep notes under 120 characters.").optional().or(z.literal("")),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
