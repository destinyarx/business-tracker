import { EXPENSE_CATEGORIES } from '@/constants'
import type { ExpensesData } from './expenses.types'

const categoryColors = [
  '#0c4b47',
  '#007f78',
  '#12cdbe',
  '#7fe0da',
  '#a8d97c',
  '#ffde68',
  '#ffb018',
] as const

export type ExpenseCategorySummary = {
  key: string
  label: string
  amount: number
  percentage: number
  color: string
}

export type ExpensePageSummary = {
  totalAmount: number
  recordCount: number
  biggestCategory?: ExpenseCategorySummary
  cashAmount: number
  cashCount: number
  digitalWalletAmount: number
  categories: ExpenseCategorySummary[]
}

export const formatExpenseAmount = (amount: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)

export const getExpenseCategoryLabel = (expense: ExpensesData): string => {
  if (expense.category.toLowerCase() === 'other' && expense.categoryOther?.trim()) {
    return expense.categoryOther.trim()
  }

  return (
    EXPENSE_CATEGORIES.find((category) => category.value === expense.category)?.name ??
    expense.category.replaceAll('_', ' ')
  )
}

export const createExpensePageSummary = (
  expenses: ExpensesData[],
): ExpensePageSummary => {
  const categoryAmounts = new Map<string, { label: string; amount: number }>()
  let totalAmount = 0
  let cashAmount = 0
  let cashCount = 0
  let digitalWalletAmount = 0

  expenses.forEach((expense) => {
    const amount = Number(expense.amount) || 0
    const paymentMethod = expense.paymentMethod.toLowerCase()
    const categoryLabel = getExpenseCategoryLabel(expense)
    const categoryKey = categoryLabel.toLowerCase()
    const currentCategory = categoryAmounts.get(categoryKey)

    totalAmount += amount
    categoryAmounts.set(categoryKey, {
      label: categoryLabel,
      amount: (currentCategory?.amount ?? 0) + amount,
    })

    if (paymentMethod === 'cash') {
      cashAmount += amount
      cashCount += 1
    }

    if (paymentMethod === 'gcash' || paymentMethod === 'maya') {
      digitalWalletAmount += amount
    }
  })

  const categories = Array.from(categoryAmounts.entries())
    .map(([key, category], index) => ({
      key,
      label: category.label,
      amount: category.amount,
      percentage: totalAmount > 0 ? (category.amount / totalAmount) * 100 : 0,
      color: categoryColors[index % categoryColors.length],
    }))
    .sort((firstCategory, secondCategory) => secondCategory.amount - firstCategory.amount)

  return {
    totalAmount,
    recordCount: expenses.length,
    biggestCategory: categories[0],
    cashAmount,
    cashCount,
    digitalWalletAmount,
    categories,
  }
}
