# AGENTS.md

## Purpose

This file defines the project context, architecture, coding standards, and implementation rules that AI coding agents must follow when working in this repository.

Follow these instructions unless the current task explicitly requires a different approach. Preserve existing application behavior and avoid unrelated refactoring.

---

## Application Overview

**Business Tracker** is an all-in-one web-based management system for small to medium-sized enterprises. It helps businesses manage and monitor their daily operations in one place.

### Core Features

#### Customers

- Create, view, update, and manage customer records.
- Store customer information needed for orders and business transactions.

#### Expenses

- Create, view, update, and manage business expenses.
- Organize expenses by type or category.
- Help users compare expenses against sales.

#### Inventory

- Manage product inventory and stock information.
- Track available inventory and inventory changes.
- Help users compare inventory movement against sales.

#### Orders

- Create, view, update, and manage orders.
- Track order status.
- Connect orders to products.
- Connect orders to registered customers.
- Allow orders to use guest customer information when a registered customer is not available.

#### Products

- Create, view, update, and manage product listings.
- Manage product inventory and other product-related details.

#### Sales

- Display sales summaries and overviews.
- Help users understand business sales performance.

---

## Backend API Repository

This frontend consumes a NestJS API located at:

```text
C:\Users\AlphaQuadrant\Documents\0 self project\Nest.js\business-tracker-api
```

When investigating API integration problems, inspect that repository to verify endpoint contracts, request and response payloads, validation rules, authentication requirements, and backend behavior. Do not assume the frontend types alone define the complete API contract. Keep frontend and backend changes coordinated when a task affects both repositories.

---

## Technology Stack

Use the following technologies and libraries already selected for this project:

- **TypeScript**
- **Next.js** using the App Router
- **Clerk** for authentication
- **TanStack Query** for server state, API state, caching, and request lifecycle management
- **Zustand** for client-side state management
- **React Hook Form** for form state management
- **Zod** for schema validation
- **shadcn/ui** for reusable UI components
- **Tailwind CSS** for styling
- **TanStack Table** for data tables
- **date-fns** for date manipulation and formatting
- **Recharts** for charts and data visualization
- **Axios** for API requests

Do not introduce a replacement library for an existing responsibility unless the task explicitly requires it.

---

## Architecture Principles

### 1. Feature-Based Organization

Organize domain-specific code by feature. Each feature should contain the files and folders related to that domain.

Examples of features include:

- `customers`
- `expenses`
- `inventory`
- `orders`
- `products`
- `sales`

Follow the existing feature root used by the repository. Do not rename the current feature directory unless explicitly requested.

### 2. Separation of Responsibilities

Keep responsibilities clearly separated:

- `*.api.ts` handles HTTP requests and Axios configuration for the feature.
- `*.service.ts` contains feature business logic and coordinates data operations.
- `*.schema.ts` contains Zod schemas.
- `*.types.ts` contains TypeScript types and interfaces.
- `hooks/` contains feature-specific React hooks and TanStack Query hooks.
- `stores/` contains feature-specific Zustand stores.
- `components/` contains feature-specific React components.
- `types/` may contain additional feature-specific type files when one type file is not enough.

Do not place business logic directly inside UI components.

### 3. State Management

Use each state-management tool only for its intended responsibility:

- Use **TanStack Query** for server state, API data, caching, loading states, mutations, invalidation, and refetching.
- Use **Zustand** for client-side application state that is not server state.
- Use local React state for small, component-specific UI state.
- Do not duplicate TanStack Query data inside a Zustand store unless the task explicitly requires it.

### 4. Forms and Validation

- Use React Hook Form for form state and submission handling.
- Use Zod for validation.
- Store feature-specific schemas in the feature's `*.schema.ts` file.
- Derive TypeScript types from Zod schemas when appropriate to avoid duplicated definitions.
- Keep validation rules consistent between create and update operations.

### 5. Styling and UI

- Use Tailwind CSS for styling.
- Use shadcn/ui components when an appropriate component already exists.
- Do not add plain CSS, CSS modules, or styled-components.
- Keep UI components reusable, accessible, and responsive.
- Use Recharts for charts and TanStack Table for complex tabular data.

---

## Recommended Feature Structure

Use the following structure as the default pattern:

```text
src/
├── app/
├── features/
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── stores/
│       ├── types/
│       ├── <feature>.api.ts
│       ├── <feature>.service.ts
│       ├── <feature>.schema.ts
│       └── <feature>.types.ts
├── components/
├── hooks/
├── stores/
└── utils/
```

If the repository already uses `src/feature/` instead of `src/features/`, follow the existing directory name.

### Shared Code

Place reusable code that is not owned by one feature in the appropriate shared directory:

- `src/components/` for shared UI components
- `src/hooks/` for shared hooks
- `src/stores/` for shared Zustand stores
- `src/utils/` for shared utility functions

Do not move feature-specific code into shared directories only to make it reusable. Move code to a shared directory only when it is genuinely used across multiple features.

---

## File Naming Standards

Use concise, descriptive, and feature-aligned file names.

Example for the customer feature:

```text
customers/
├── components/
├── hooks/
│   └── use-customers.ts
├── stores/
│   └── customer.store.ts
├── types/
├── customer.api.ts
├── customer.service.ts
├── customer.schema.ts
└── customer.types.ts
```

Use the repository's existing naming style consistently. Do not mix naming conventions within the same feature.

Recommended patterns:

- Components: `customer-form.tsx`, `customer-table.tsx`
- Hooks: `use-customers.ts`, `use-create-customer.ts`
- API files: `customer.api.ts`
- Service files: `customer.service.ts`
- Store files: `customer.store.ts`
- Type files: `customer.types.ts`
- Schema files: `customer.schema.ts`

---

## TypeScript Standards

- Always use TypeScript.
- Do not use `any`.
- Do not use `unknown`.
- Define explicit types for function parameters, return values, component props, service responses, and API payloads.
- Reuse existing types instead of creating duplicate types.
- Keep types close to the feature that owns them.
- Use clear and concise type names.
- Prefer type-safe narrowing and validation over unsafe type assertions.
- Avoid unnecessary type casting.
- Do not suppress TypeScript errors without a documented and task-specific reason.

---

## Service Layer Standards

Feature services are responsible for business logic.

Services should:

- Validate required input before processing.
- Use guard clauses for invalid conditions and error cases.
- Avoid deeply nested conditional logic.
- Call the feature API layer when remote data is required.
- Return predictable and explicitly typed results.
- Preserve useful error information.
- Keep UI-specific behavior out of the service layer.

Example responsibility flow:

```text
Component
  → TanStack Query hook
    → Feature service
      → Feature API
        → Backend endpoint
```

Do not call Axios directly from a UI component when the request belongs to a feature API or service.

---

## API Layer Standards

Feature API files should:

- Contain Axios-based HTTP requests.
- Define typed request payloads and typed responses.
- Keep endpoint-specific request logic in one place.
- Avoid business rules that belong in the service layer.
- Throw or return errors in a consistent format that the service layer can handle.
- Return untrusted response bodies to the service layer for runtime validation; TypeScript response types alone are not validation.

Use TanStack Query hooks to call services rather than manually managing API loading and error state inside components.

---

## TanStack Query Standards

- Create feature-specific query and mutation hooks inside the feature's `hooks/` directory.
- Use stable and descriptive query keys.
- Keep query keys consistent across reads, mutations, invalidation, and refetching.
- Invalidate or update the appropriate cached data after successful mutations.
- Use TanStack Query loading, error, and success states instead of duplicating them in Zustand.
- Keep API calls and business logic outside query hook definitions when they already belong in API or service files.

---

## Zustand Standards

- Use Zustand only for client-side state shared across components.
- Keep each store focused on one responsibility.
- Use concise and descriptive store names.
- Define an explicit TypeScript type for every store.
- Do not store API data in Zustand when TanStack Query already manages it.
- Do not create a global store for state that is only used by one component.

---

## React Component Standards

- Keep components focused on presentation and user interaction.
- Move reusable logic into hooks, services, or utility functions.
- Keep components small and readable.
- Use explicit prop types.
- Use concise and descriptive component names.
- Avoid performing API requests directly inside components.
- Use Server Components by default when possible.
- Add `'use client'` only when the component requires client-side hooks, browser APIs, event handlers, Zustand, React Hook Form, or other client-only behavior.
- Do not convert a Server Component into a Client Component without a clear requirement.

### React Memoization

- Treat `useMemo` as a measured performance optimization, not a default or a correctness guarantee.
- Use it only when a calculation is meaningfully expensive, a stable value is passed to a memoized child, or identity stability prevents an Effect or another Hook dependency from rerunning unnecessarily.
- Do not memoize cheap factories or values used only within the same render. Prefer `const customersApi = createCustomersApi(api)` unless stable identity has a demonstrated consumer.

---

## Code Style

- Use single quotes for TypeScript and JavaScript strings.

```ts
const status = 'pending';
```

- Use double quotes for JSX and HTML attributes.

```tsx
<Button type="submit" aria-label="Save customer">
  Save
</Button>
```

- Use concise and readable names for:
  - variables
  - functions
  - components
  - hooks
  - stores
  - API functions
  - services
  - types
  - schemas

- Avoid vague names such as:
  - `data`
  - `item`
  - `temp`
  - `value`
  - `handleThing`
  - `doAction`

Use domain-specific names such as:

- `customer`
- `expenseCategory`
- `orderStatus`
- `productInventory`
- `salesSummary`
- `createCustomer`
- `updateOrderStatus`

---

## Error Handling

- Use guard clauses for validation and error handling.
- Handle errors at the correct layer.
- Services should translate low-level API errors into meaningful feature-level errors when necessary.
- UI components should display user-friendly error messages.
- Do not silently ignore errors.
- Do not use empty `catch` blocks.
- Do not expose sensitive implementation details to users.
- Keep error behavior consistent across features.
- Services must throw typed feature failures after translating transport or response-validation errors.
- UI cleanup and success feedback must run only after an awaited mutation succeeds.

Example:

```ts
export const getCustomerById = async (
  customerId: string,
): Promise<Customer> => {
  if (!customerId) {
    throw new Error('Customer ID is required.');
  }

  return customerApi.getById(customerId);
};
```

---

## Authentication

- Use Clerk for authentication.
- Protect authenticated pages and operations using the project's existing Clerk integration.
- Do not create a second authentication system.
- Do not expose authentication tokens, secrets, or private user information in client-side code.
- Verify authentication before performing protected operations.
- Follow the existing authorization and role-checking patterns in the repository.

---

## Date Handling

- Use date-fns for date parsing, formatting, comparison, and manipulation.
- Do not create custom date helpers when date-fns already provides the required behavior.
- Keep stored dates and displayed dates clearly separated.
- Avoid relying on locale-dependent string parsing.

---

## Tables and Charts

### Tables

- Use TanStack Table for complex, sortable, filterable, paginated, or selectable tables.
- Keep column definitions readable and feature-specific.
- Extract large column configurations into dedicated feature files when needed.

### Charts

- Use Recharts for sales, expense, inventory, and other business visualizations.
- Keep chart data transformation outside presentation-heavy chart markup when possible.
- Use meaningful labels, legends, tooltips, and accessible descriptions.

---

## Agent Workflow

Before making changes:

1. Read the relevant existing files.
2. Identify the feature that owns the requested behavior.
3. Follow nearby naming and implementation patterns.
4. Reuse existing components, hooks, services, schemas, types, and utilities.
5. Confirm whether the change affects API, service, validation, state, and UI layers.

While making changes:

1. Make the smallest complete change that satisfies the task.
2. Preserve existing behavior unless the task explicitly requests a behavior change.
3. Keep business logic out of components.
4. Keep API calls inside feature API files.
5. Keep Zod schemas inside feature schema files.
6. Keep server state in TanStack Query.
7. Keep client-only shared state in Zustand.
8. Avoid unrelated cleanup or refactoring.
9. Record durable architecture decisions in `docs/adr/` and reusable special coding conventions in `AGENTS.md`; skip both for routine implementation details.

### Project Context Documentation

`CONTEXT.md` is the durable project reference for future AI agents. Keep it accurate enough that an agent can understand the application's domain and established behavior without repeatedly scanning the entire repository.

Update `CONTEXT.md` when a change adds, removes, or materially changes project knowledge such as:

- Module responsibilities and relationships.
- User-visible application behavior and business rules.
- Important module flows and state transitions.
- Forms, their fields, and meaningful validation behavior.
- Tables and lists, including their significant columns, filters, and actions.
- Domain types, statuses, categories, and terminology.
- Important data relationships, derived values, and backend-facing behavior.

Keep `CONTEXT.md` concise and current. Update or remove statements that become outdated. Do not add routine styling adjustments, temporary debugging notes, or low-level implementation details that do not help a future agent understand the application.

After making changes:

1. Check TypeScript types.
2. Check imports and file paths.
3. Check validation and error states.
4. Check loading, empty, success, and failure states when applicable.
5. Run lint, type-check, and build checks when they are applicable to the change.
6. Run only tests related to the changed or affected behavior. Do not run unrelated test suites or add excessive tests for unaffected modules.
7. Broaden testing only when the change affects shared infrastructure, shared components, or cross-module contracts, or when a targeted check reveals a wider regression risk.
8. Stop every localhost server or background process the agent started for testing when the test finishes or the task is complete and the process is no longer needed. Before the final response, verify that each port opened by the agent is no longer listening. Do not stop a pre-existing process that the agent did not start.
9. Report any checks that could not be completed.

---

## Prohibited Patterns

Do not:

- Use JavaScript when TypeScript is expected.
- Use `any`.
- Use `unknown`.
- Put business logic directly inside UI components.
- Call Axios directly from components when a feature API or service should own the request.
- Store TanStack Query server data in Zustand without an explicit requirement.
- Add plain CSS, CSS modules, or styled-components.
- Introduce duplicate schemas, types, hooks, or utilities.
- Introduce a replacement library for an existing technology without explicit approval.
- Rename or reorganize unrelated files.
- Change application behavior outside the requested scope.
- Hide errors with empty `catch` blocks or TypeScript suppression comments.
- Expose secrets, tokens, credentials, or sensitive customer data.

---

## Definition of Done

A task is complete when:

- The requested behavior is implemented.
- Existing behavior outside the task remains unchanged.
- Code follows the feature-based structure.
- API, service, schema, type, hook, store, and component responsibilities remain separated.
- TypeScript types are explicit.
- Forms use React Hook Form and Zod when applicable.
- Server state uses TanStack Query.
- Client-side shared state uses Zustand only when appropriate.
- Styling uses Tailwind CSS and existing shadcn/ui components.
- Error, loading, empty, and success states are handled when applicable.
- Existing project checks pass, or any unresolved issue is clearly reported.
