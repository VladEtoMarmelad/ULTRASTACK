"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/navigation' for App Router

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Get the token from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Store the token in localStorage for subsequent API calls
      localStorage.setItem('access_token', token);
      
      // Navigate to the dashboard or home page after saving the token
      router.push('/'); 
    } else {
      // Handle error if token is missing
      router.push('/login?error=auth_failed');
    }
  }, [router]);

  return <div>Completing login, please wait...</div>;
}