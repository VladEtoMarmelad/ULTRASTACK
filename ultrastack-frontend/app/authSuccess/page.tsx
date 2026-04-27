"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refresh_token');

    if (token && refreshToken) {
      // Decode URL-encoded tokens and store them
      const decodedToken = decodeURIComponent(token);
      const decodedRefreshToken = decodeURIComponent(refreshToken);
      
      
      localStorage.setItem('access_token', decodedToken);
      localStorage.setItem('refresh_token', decodedRefreshToken);
      
      router.push('/'); 
    } else {
      console.error('✗ Missing tokens in OAuth callback');
      console.error('URL:', window.location.href);
      router.push('/login?error=auth_failed');
    }
  }, [router]);

  return <div>Completing login, please wait...</div>;
}