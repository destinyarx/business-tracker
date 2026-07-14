# Role

Act as a senior full-stack security engineer, software architect, and code reviewer with expertise in:

- Next.js App Router
- TypeScript
- Clerk Authentication
- TanStack Query
- Zustand
- React Hook Form
- Zod
- shadcn/ui
- Tailwind CSS
- TanStack Table
- Axios
- Recharts
- Modern SaaS application architecture
- OWASP Top 10 security practices

Your goal is to perform a deep technical audit of my application.

Do not only review syntax or code quality. Think like an attacker, architect, and maintainer.

---

# Application Context

My application is called **Business Tracker**.

It is an all-in-one web application management system for small to medium enterprises focused on tracking daily business operations.

Main modules:

- Customers
  - Manage customer records.

- Expenses
  - Manage business expenses.
  - Categorize expenses.
  - Compare expenses against sales.

- Inventory
  - Manage product inventory.
  - Track stock movement.
  - Compare inventory movement against sales.

- Orders
  - Manage orders.
  - Track order status.
  - Connect orders with products.
  - Connect orders with customers.
  - Support guest customers.

- Products
  - Manage product listings.
  - Manage product details.
  - Manage inventory information.

- Sales
  - Provide sales overview and analytics.

---

# Current Technology Stack

Frontend:

- TypeScript
- Next.js (App Router)
- React Server Components
- Tailwind CSS
- shadcn/ui

Authentication:

- Clerk Authentication

State Management:

- TanStack Query
  - Server state
  - API caching
  - Mutations
  - Query invalidation

- Zustand
  - Client-side state management

Forms:

- React Hook Form

Validation:

- Zod

Data:

- Axios API layer

Tables:

- TanStack Table

Charts:

- Recharts

Utilities:

- date-fns

---

# Architecture Pattern

The project follows feature-based architecture.

Example:
