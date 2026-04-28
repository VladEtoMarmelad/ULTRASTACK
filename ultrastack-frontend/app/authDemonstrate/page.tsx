"use client";

import { useEffect, useState } from 'react';
import { User } from "@sharedTypes/User";

export default function UserProfileInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to refresh the access token when it expires
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch('http://localhost:3030/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const { access_token } = await response.json();
        localStorage.setItem('access_token', access_token);
        return access_token;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
    return null;
  };

  const fetchProfile = async (token: string | null) => {
    if (!token) {
      console.error('✗ No token provided to fetchProfile');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}` // Ensure Bearer prefix is present
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } else if (response.status === 401) {
        // Access token might be expired, try to refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the profile fetch with the new token
          await fetchProfile(newToken);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetchProfile(token);
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">User Profile (Verified)</h2>
      <div className="flex items-center gap-4 mb-4">
        {user.avatarUrl && (
          <img src={user.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full" />
        )}
        <div>
          <p className="font-bold">{user.name}</p>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
      </div>
      <ul className="space-y-1 border-t pt-2">
        <li className="text-sm"><span className="font-mono font-bold">ID:</span> {user.id}</li>
        <li className="text-sm"><span className="font-mono font-bold">Provider:</span> {user.provider}</li>
      </ul>
    </div>
  );
}