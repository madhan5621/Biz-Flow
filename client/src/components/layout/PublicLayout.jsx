import { Outlet } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { APP_NAME } from '../../lib/constants';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/20 rounded-full" />
          <div className="absolute bottom-32 right-16 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/10 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">{APP_NAME}</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your entire business
            <br />
            from one intelligent dashboard.
          </h1>

          <p className="text-lg text-primary-100 max-w-md leading-relaxed">
            Streamline operations, track finances, manage employees and customers — all in one powerful platform.
          </p>

          <div className="flex gap-8 mt-12">
            {[
              { value: '10k+', label: 'Businesses' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">
              {APP_NAME}
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
