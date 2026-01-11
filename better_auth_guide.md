# Better Auth Integration Guide

This guide documents the setup of Better Auth in this Next.js project, covering installation, Google OAuth configuration, and authentication checks.

## 1. Installation & Setup

### Dependencies
Install the `better-auth` package:
```bash
npm install better-auth
```

### Environment Variables (.env)
Ensure your `.env` file contains the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
BETTER_AUTH_SECRET="your_generated_secret_key"
BETTER_AUTH_URL="http://localhost:3000" # Base URL of your app
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Backend Configuration (`src/lib/auth.ts`)
Initialize the auth instance with your database adapter and providers.

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma"; // Your prisma client instance

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // ... other config (user model extensions, etc.)
});
```

### Client Configuration (`src/lib/auth-client.ts`)
Export the client-side hooks and functions.

```typescript
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient();
```

### API Route Handler (`src/app/api/auth/[...all]/route.ts`)
Expose the auth endpoints to your application.

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

---

## 2. Google Sign-In Implementation

### How it works: Backend vs Frontend
The implementation consists of two distinct parts:
1.  **Backend (`src/lib/auth.ts`)**: Enables the provider by adding your API keys.
    ```typescript
    // In auth.ts
    socialProviders: {
      google: { ... }
    }
    ```
2.  **Frontend (`src/app/sign-in/page.tsx`)**: Triggers the login flow using the client SDK.
    ```typescript
    // In page.tsx
    await signIn.social({
      provider: "google", ...
    })
    ```

### Frontend Handler

### Frontend Handler
In your Sign-In or Sign-Up page (e.g., `src/app/sign-in/page.tsx`), use the `signIn.social` method.

```tsx
import { signIn } from "@/lib/auth-client";

// ... inside your component
async function handleGoogleSignIn() {
  await signIn.social({
    provider: "google",
    callbackURL: "/dashboard", // Redirect destination after login
  });
}

// ... in your JSX
<Button onClick={handleGoogleSignIn}>
  Sign in with Google
</Button>
```

---

## 3. Checking Authentication Status

### Client-Side (React Components)
Use the `useSession` hook in Client Components (`"use client"`).

```tsx
"use client";
import { useSession } from "@/lib/auth-client";

export default function UserStatus() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <p>Signed in as: {session.user.email}</p>
      <p>Name: {session.user.name}</p>
    </div>
  );
}
```

### Server-Side (API Routes)
Use `auth.api.getSession` with the request headers.

```typescript
// src/app/api/me/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: session.user,
    session: session.session
  });
}
```

### Server-Side (Server Components)
Use `auth.api.getSession` to protect pages or fetch data.

```typescript
// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  return (
    <div>
      <h1>Welcome back, {session.user.name}</h1>
    </div>
  );
}
```
