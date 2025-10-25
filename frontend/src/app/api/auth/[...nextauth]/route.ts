import NextAuth from 'next-auth';

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import serverApi from '@/src/lib/server-api';
import { jwtDecode } from 'jwt-decode';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // Đây là hàm xử lý logic xác thực
      async authorize(credentials, req) {
        try {
          const res = await serverApi.post('/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          });

          const { user, accessToken } = res.data.data;
          if (user && accessToken) {
            return {
              ...user,
              accessToken,
            };
          }

          return null;
        } catch (error: any) {
          console.error('Authorize error:', error.response.data);
          throw new Error(
            error.response.data.message || 'Authentication failed'
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;

        token.id = user.id;
        token.username = user.username;
        token.email = user.email!;

        // Giải mã token để lấy thời gian hết hạn
        const decodedAccessToken = jwtDecode<{ exp: number }>(user.accessToken);
        token.accessTokenExpires = decodedAccessToken.exp * 1000;

        return token;
      }

      // Kiểm tra xem accessToken còn hạn không. Thêm một khoảng đệm 60 giây.
      if (Date.now() < (token.accessTokenExpires as number) - 60000) {
        // Nếu còn hạn, trả về token hiện tại
        return token;
      }

      return token;
    },

    async session({ session, token }) {
      // `token` ở đây là object được trả về từ callback `jwt` ở trên
      if (token) {
        session.user.name = token.username; // Vẫn giữ tên hiển thị

        session.user.id = token.id;
        session.user.username = token.username; // <-- Quan trọng
        session.user.email = token.email; // Vẫn giữ email

        session.accessToken = token.accessToken;
      }
      return session;
    },

    // Callback khi redirect sau khi đăng nhập
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/login`;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
