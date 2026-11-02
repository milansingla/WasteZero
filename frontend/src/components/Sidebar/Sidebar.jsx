// src/components/Sidebar/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Recycle, Users, Building2, FileBarChart, 
  Settings, LogOut, ChevronLeft, ChevronRight, Briefcase, 
  HeartHandshake, PlusCircle, UserCircle, BarChart, Mail, ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, demoLogin, loading: authLoading, api } = useAuth();
  const [stats, setStats] = useState({});
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  // Debug (remove in production)
  // console.log('[Sidebar] user:', user, 'authLoading:', authLoading);

  // Keep this hook before auth-related early returns so the sidebar keeps a
  // consistent hook order while authentication is restored.
  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      if (!user || !api) return;
      try {
        if (user.role === 'volunteer') {
          const [userRes, unreadRes] = await Promise.all([
            api.get('/api/user/dashboard/stats').catch(() => ({ data: {} })),
            api.get('/api/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
          ]);
          if (!mounted) return;
          setStats({
            applications: userRes.data?.applications || userRes.data?.applicationCount || 0,
            pickups: userRes.data?.pickups || 0,
            unread: unreadRes.data?.count ?? 0,
          });
        } else if (user.role === 'ngo') {
          const [ngoRes, unreadRes] = await Promise.all([
            api.get('/api/ngo/dashboard/stats').catch(() => ({ data: {} })),
            api.get('/api/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
          ]);
          if (!mounted) return;
          setStats({
            opportunities: ngoRes.data?.opportunities || ngoRes.data?.opportunityCount || 0,
            applications: ngoRes.data?.applications || ngoRes.data?.applicationCount || 0,
            unread: unreadRes.data?.count ?? 0,
          });
        } else if (user.role === 'admin') {
          const [adminRes, unreadRes] = await Promise.all([
            api.get('/api/admin/dashboard/stats').catch(() => ({ data: {} })),
            api.get('/api/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
          ]);
          if (!mounted) return;
          setStats({
            users: adminRes.data?.users || 0,
            reports: adminRes.data?.reports || 0,
            pendingPickups: adminRes.data?.pickups?.pending || 0,
            unread: unreadRes.data?.count ?? 0,
          });
        }
      } catch (err) {
        console.warn('[Sidebar] fetchStats failed', err);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, [user, api]);

  if (authLoading) {
    return (
      <aside className="wz-sidebar-shell text-white h-full w-72 shrink-0 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-400 mb-4" />
        <p className="text-green-300">Loading...</p>
      </aside>
    );
  }

  // If somehow no user in protected area → redirect handled by ProtectedRoute, but show fallback
  if (!user) {
    return (
      <aside className="wz-sidebar-shell text-white h-full w-72 shrink-0 flex flex-col items-center justify-center p-6 text-center">
        <UserCircle className="h-16 w-16 text-red-400 mb-4" />
        <p className="text-red-300 mb-4">Session expired or not authenticated</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
        >
          Go to Login
        </button>
      </aside>
    );
  }

  const isNGO = user.role === 'ngo';
  const isVolunteer = user.role === 'volunteer';
  const showDemoSwitch = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

  const dashboardPath = user.role === 'admin' ? '/admin-dashboard' : user.role === 'ngo' ? '/ngo-dashboard' : user.role === 'volunteer' ? '/user-dashboard' : '/dashboard';

  const navItems = [
    // Always visible (role-specific dashboard path)
    { path: dashboardPath, label: 'Dashboard', icon: LayoutDashboard, exact: true },

    // Volunteer-specific
    ...(isVolunteer ? [
      { path: '/opportunities', label: 'Browse Opportunities', icon: Briefcase },
      { path: '/dashboard/my-applications', label: 'My Applications', icon: HeartHandshake },
    ] : []),

    // NGO-specific
    ...(isNGO ? [
      { path: '/dashboard/opportunities', label: 'My Opportunities', icon: Briefcase },
      { path: '/dashboard/opportunities/create', label: 'Create New', icon: PlusCircle },
      // posted history is same as My Opportunities (route '/dashboard/opportunities')
    ] : []),

    // Admin-specific
    ...(user.role === 'admin' ? [
      { path: '/admin/pickups', label: 'Pickup Requests', icon: Recycle },
      { path: '/admin/users', label: 'User Management', icon: Users },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart },
      { path: '/admin/reports', label: 'Reports', icon: FileBarChart },
    ] : []),

    // Shared
    { path: '/dashboard/pickups', label: 'Pickups', icon: Recycle },
    ...(user.role === 'admin' ? [
      { path: '/dashboard/volunteers', label: 'Volunteers', icon: Users },
      { path: '/dashboard/ngos', label: 'NGOs', icon: Building2 },
    ] : []),
    ...(isNGO ? [
      { path: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
    ] : []),
    // messaging (all roles)
    { path: '/chat', label: 'Messages', icon: Mail },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed – try again');
      console.error('Logout error:', err);
    }
  };

  const handleDemoRoleChange = async (role) => {
    setDemoLoading(true);
    try {
      await demoLogin(role);
      const destination = role === 'ngo' ? '/ngo-dashboard' : role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
      navigate(destination, { replace: true });
      toast.success(`Switched to ${role} demo`);
    } catch (err) {
      toast.error(err.message || 'Could not switch demo role');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <aside 
      className={`
        wz-sidebar-shell
        text-white h-full shrink-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        relative shadow-2xl shadow-black/40 z-30 flex flex-col overflow-hidden
      `}
    >
      {/* Logo + Collapse Toggle */}
      <div className="p-5 flex items-center justify-between border-b border-green-800/30">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <Recycle className="h-8 w-8 text-green-400 animate-pulse" />
            <h1 className="text-2xl font-extrabold tracking-tight">WasteZero</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-green-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-5 px-3 flex-1 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-green-700">
        {navItems.map((item) => {
          const path = item.path || '';
          let badgeCount = 0;
          if (path.includes('applications')) badgeCount = stats.applications || 0;
          else if (path === '/admin/pickups') badgeCount = stats.pendingPickups || 0;
          else if (path.includes('/opportunities') && user?.role === 'ngo') badgeCount = stats.opportunities || 0;
          else if (path.includes('pickups')) badgeCount = stats.pickups || 0;
          else if (path.includes('reports')) badgeCount = stats.reports || 0;
          else if (path.includes('volunteers')) badgeCount = stats.users || 0;

          return (
            <NavLink
              key={`${item.path}-${item.label}`}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `relative group flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-[#e6e9c9] text-[#2e5840] font-semibold shadow-md' 
                  : 'text-[#f2f1e8] hover:bg-white/10 hover:text-white'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Badge */}
              {badgeCount > 0 && !isCollapsed && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  {badgeCount}
                </span>
              )}

              {badgeCount > 0 && isCollapsed && (
                <span className="absolute -right-1 top-3 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {showDemoSwitch && (
        <div className={`mx-3 my-3 rounded-xl border border-emerald-700/50 bg-black/15 p-2 ${isCollapsed ? 'grid gap-1' : ''}`}>
          {!isCollapsed && <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">Switch demo role</p>}
          {[
            { role: 'volunteer', label: 'Volunteer', icon: Users },
            { role: 'ngo', label: 'NGO Partner', icon: Building2 },
            { role: 'admin', label: 'Administrator', icon: ShieldCheck },
          ].map((demoRole) => (
            <button
              key={demoRole.role}
              type="button"
              onClick={() => handleDemoRoleChange(demoRole.role)}
              disabled={demoLoading}
              title={isCollapsed ? `Switch to ${demoRole.label} demo` : undefined}
              className={`w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs text-emerald-50 transition hover:bg-emerald-800/70 disabled:opacity-50 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <demoRole.icon size={16} className="shrink-0 text-lime-200" />
              {!isCollapsed && <span>{demoRole.label}</span>}
            </button>
          ))}
        </div>
      )}

      {/* User Profile Section */}
      <div className="p-5 border-t border-green-800/30 mt-auto">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-green-900/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          title="View / Edit Profile"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center font-bold text-xl shadow-lg flex-shrink-0 overflow-hidden border-2 border-green-400/40">
            {user.profilePicture ? (
              <img
                src={user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profilePicture}`}
                alt={user.name || 'Profile'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=10b981&color=fff&size=128`;
                }}
              />
            ) : (
              (user.name?.[0] || 'U').toUpperCase()
            )}
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-semibold truncate text-green-50">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-green-300 truncate">
                {user.email || 'No email'}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-800/60 text-green-200 text-xs rounded-full capitalize">
                {user.role}
              </span>
            </div>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl 
                     bg-red-900/30 hover:bg-red-800/50 text-red-300 hover:text-red-100 
                     transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
