'use client';

import { Home, Users, Airplay } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: Array<{ path: string; label: string; icon: typeof Home }>;
  isActive: (path: string) => boolean;
  onSignOut: () => Promise<void>;
}

export function MobileMenu({ isOpen, navItems, isActive, onSignOut }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white shadow-md absolute w-full z-10 left-0 p-4 space-y-4">
      {navItems.map(({ path, label, icon: Icon }) => (
        <a
          key={path}
          href={path}
          className={`flex items-center space-x-2 text-lg font-medium ${
            isActive(path) ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
          }`}
        >
          <Icon className="h-5 w-5 inline-block mr-2" />
          <span>{label}</span>
        </a>
      ))}
      <button
        onClick={onSignOut}
        className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
} 