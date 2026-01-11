# Adding Custom Fields to Better Auth

This guide outlines the 3-step process to add new fields (like `age`, `phone`, `role`) to your user profile.

## 1. The Foundation (Database)

First, add the field to your database schema so it can be stored.

**File:** `prisma/schema.prisma`

```prisma
model User {
  // ... existing fields
  id            String    @id @default(cuid())
  email         String    @unique
  // highlight-start
  age           Int?      // Your new optional field
  // highlight-end
  // ...
}
```

> [!IMPORTANT]
> **Apply the Change:**
> After saving the file, you must run this command in your terminal:
> ```bash
> npx prisma migrate dev
> ```

## 2. The Permission (Auth Config)

Tell Better Auth that it is "safe" to accept this field during sign-up.

**File:** `src/lib/auth.ts`

```typescript
export const auth = betterAuth({
  // ...
  user: {
    additionalFields: {
      // Key must match the Prisma model field name
      age: {
        type: "number",   // "string", "number", or "boolean"
        required: false,  // Set to true if it must be provided
      },
    },
  },
});
```

## 3. The Input (Frontend)

Collect the data from the user and send it to the backend.

**File:** `src/app/sign-up/page.tsx`

```tsx
// 1. Add the input to your form
<input 
  name="age" 
  type="number" 
  placeholder="Age" 
/>

// 2. Send it in the signUp function
await signUp.email({
  email: formData.get("email"),
  password: formData.get("password"),
  name: formData.get("name"),
  // Convert to the correct type (Number for Int, String for String)
  age: Number(formData.get("age")), 
});
```

---

### Troubleshooting
If you see an error like `Unknown argument 'age'` or `Model does not exist`:
1.  **Stop** your development server (Ctrl+C).
2.  Run `npx prisma generate`.
3.  **Start** the server again with `npm run dev`.
