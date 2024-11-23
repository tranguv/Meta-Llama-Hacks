import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            // httpOptions: {
            //     timeout: 40000,
            // },
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(credentials),
                    }
                );
                const user = await res.json();
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${account?.id_token}`,
                        },
                    }
                );
                const resParsed = await res.json();
                token = Object.assign({}, token, {
                    id_token: account.id_token,
                });
                token = Object.assign({}, token, {
                    myToken: resParsed.authToken,
                });
            }

            return token;
        },
        async session({ session, token }) {
            if (session) {
                session = Object.assign({}, session, {
                    id_token: token.id_token,
                });
                session = Object.assign({}, session, {
                    authToken: token.myToken,
                });
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST, handler };
