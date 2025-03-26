'use client';

import { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function NavLink({ path, label, icon: Icon, isActive }: NavLinkProps) {
  return (
    <a
      href={path}
      className={`flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-md ${
        isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
} 