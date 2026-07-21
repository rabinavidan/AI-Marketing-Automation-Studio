'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  testId: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', testId: 'nav-dashboard', icon: '📊' },
  { href: '/product-brief', label: 'Product Brief', testId: 'nav-product-brief', icon: '📝' },
  { href: '/generated-content', label: 'Generated Content', testId: 'nav-generated-content', icon: '🪄' },
  { href: '/prompt-library', label: 'Prompt Library', testId: 'nav-prompt-library', icon: '📚' },
  {
    href: '/image-prompt-generator',
    label: 'Image Prompt Generator',
    testId: 'nav-image-prompt-generator',
    icon: '🖼️',
  },
  { href: '/trends', label: 'Trends', testId: 'nav-trends', icon: '📈' },
  { href: '/tasks', label: 'Tasks', testId: 'nav-tasks', icon: '✅' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-full sm:w-60 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 bg-white sm:h-screen sm:sticky sm:top-0">
      <div className="hidden sm:block px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-gray-900 leading-tight text-sm">
            AI Marketing
            <br />
            Automation Studio
          </span>
        </div>
      </div>
      <nav className="flex flex-row sm:flex-col flex-1 overflow-x-auto sm:overflow-y-auto sm:overflow-x-visible py-2 sm:py-4 px-2 sm:px-3 gap-1 sm:gap-0 sm:space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className={`flex items-center gap-2 sm:gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden sm:block px-5 py-4 text-xs text-gray-400 border-t border-gray-100">
        Cosmetics Marketing AI Suite
      </div>
    </aside>
  );
}
