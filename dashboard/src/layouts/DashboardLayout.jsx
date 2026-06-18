import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Sessions', href: '/', icon: LayoutDashboard },
    { name: 'Heatmap', href: '/heatmap', icon: Map },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <LayoutDashboard size={24} />
            Flowlytics
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="text-sm text-gray-500 font-medium">Analytics Dashboard</div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
