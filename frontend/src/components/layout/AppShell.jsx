import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Heart, LogOut, Menu, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const navByRole = {
  DONOR: [
    { label: 'Dashboard', path: '/donor/dashboard' },
    { label: 'Requests', path: '/donor/requests' },
    { label: 'Connections', path: '/donor/connections' },
    { label: 'Profile', path: '/donor/profile' },
  ],
  RECIPIENT: [
    { label: 'Dashboard', path: '/recipient/dashboard' },
    { label: 'Requests', path: '/recipient/requests' },
    { label: 'Create Request', path: '/recipient/requests/new' },
    { label: 'Donors', path: '/recipient/donors' },
    { label: 'Connections', path: '/recipient/connections' },
    { label: 'Profile', path: '/recipient/profile' },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Blood Requests', path: '/admin/blood-requests' },
    { label: 'Connections', path: '/admin/connections' },
  ],
};

const AppShell = ({ role, children }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navByRole[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:flex-col bg-white border-slate-200 border-r w-72">
          <div className="flex items-center gap-3 px-6 py-5 border-slate-200 border-b">
            <div className="flex justify-center items-center bg-red-600 shadow-sm rounded-xl w-10 h-10 text-white">
              <Heart className="w-5 h-5" fill="currentColor" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">BloodConnect</div>
              <div className="text-slate-500 text-xs uppercase tracking-[0.2em]">{role}</div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-slate-200 border-t">
            <button
              type="button"
              onClick={handleLogout}
              className="flex justify-center items-center gap-2 hover:bg-red-50 px-4 py-3 border border-slate-200 hover:border-red-200 rounded-xl w-full font-medium text-slate-700 hover:text-red-700 text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="bg-white/95 backdrop-blur-sm border-slate-200 border-b">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className="lg:hidden p-2 border border-slate-200 rounded-lg text-slate-700"
                  aria-label="Open navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-[0.22em]">Dashboard</p>
                  <h1 className="font-bold text-slate-900 text-lg">{role} Portal</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="hover:bg-slate-100 p-2 border border-slate-200 rounded-full text-slate-600">
                  <Bell className="w-4 h-4" />
                </button>

                <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-2 border border-slate-200 rounded-full">
                  <div className="flex justify-center items-center bg-red-100 rounded-full w-8 h-8 text-red-700">
                    {user?.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 text-sm">{user?.name || 'BloodConnect User'}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">{user?.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {mobileOpen && (
              <div className="lg:hidden bg-white p-4 border-slate-200 border-t">
                <div className="space-y-2">
                  {items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-sm font-medium ${
                          isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
