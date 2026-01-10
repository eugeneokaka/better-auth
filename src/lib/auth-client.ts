// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";

// export const { GET, POST } = toNextJsHandler(auth);
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient();
