'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { Menu, X, Plane, Home, Users, Airplay } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { NavLink } from '../components/Navigation/NavLink';
import { MobileMenu } from '../components/Navigation/MobileMenu';
import { toast, Toaster } from 'sonner';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/flights', label: 'Flights', icon: Airplay }
];

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
    toast.success('Signed out successfully');
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const showNav = !pathname.startsWith('/login');
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {showNav && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                <Plane className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold text-indigo-600">Flight Manager</span>
              </div>
              <div className="hidden md:flex space-x-8">
                {navItems.map((item) => (
                  <NavLink key={item.path} {...item} isActive={isActive(item.path)} />
                ))}
              </div>
              <div className="flex items-center">
                <button
                  onClick={signOut}
                  className="hidden md:block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 cursor-pointer"
                >
                  Sign out
                </button>
                <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? (
                    <X className="h-6 w-6 text-indigo-600 cursor-pointer" />
                  ) : (
                    <Menu className="h-6 w-6 text-indigo-600 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <MobileMenu
            isOpen={menuOpen}
            navItems={navItems}
            isActive={isActive}
            onSignOut={signOut}
          />
        </nav>
      )}
      <Toaster />
      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative ${!showNav ? 'min-h-screen' : ''}`}>
        {children}
      </main>
    </AuthContext.Provider>
  );
}