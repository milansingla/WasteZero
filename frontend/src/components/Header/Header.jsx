import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogOut, Menu, Recycle, Settings, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Home', end: true },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/locations', label: 'Collection points' },
  { path: '/opportunities', label: 'Get involved' },
  { path: '/rewards', label: 'Rewards' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];
const MotionDiv = motion.div;

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : user?.role === 'ngo' ? '/ngo-dashboard' : '/user-dashboard';
  const initials = (user?.name || 'Member').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const closeMenus = () => { setMobileOpen(false); setProfileOpen(false); };
  const signOut = () => { logout(); closeMenus(); };

  return (
    <>
      <header className="wz-header">
        <div className="wz-header-inner">
          <Link to="/" className="wz-brand" aria-label="WasteZero home" onClick={closeMenus}><span className="wz-brand-mark"><Recycle size={21} /></span><span>WasteZero<span className="wz-brand-period">.</span></span></Link>
          <nav className="wz-desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => clsx('wz-nav-link', isActive && 'is-active')}>{item.label}</NavLink>)}
          </nav>
          <div className="wz-header-actions">
            {isAuthenticated ? <div className="wz-profile-wrap">
              <button className="wz-profile-button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open account menu"><span className="wz-avatar">{initials}</span><span className="wz-profile-name">{user?.name?.split(' ')[0] || 'Account'}</span><ChevronDown size={15} /></button>
              <AnimatePresence>{profileOpen && <MotionDiv className="wz-profile-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <div className="wz-profile-meta"><strong>{user?.name || 'Member'}</strong><span>{user?.email}</span><small>{user?.role || 'Community member'}</small></div>
                <Link to={dashboardPath} onClick={closeMenus}><LayoutDashboard size={16} /> Your dashboard</Link>
                <Link to="/profile" onClick={closeMenus}><Settings size={16} /> Profile settings</Link>
                <button onClick={signOut}><LogOut size={16} /> Sign out</button>
              </MotionDiv>}</AnimatePresence>
            </div> : <div className="wz-auth-actions"><Link className="wz-login-link" to="/login">Log in</Link><Link className="wz-header-cta" to="/register">Join the loop <ArrowUpRight size={16} /></Link></div>}
            <button className="wz-menu-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>
      <AnimatePresence>{mobileOpen && <MotionDiv className="wz-mobile-panel" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        <nav aria-label="Mobile navigation">{navItems.map((item) => <NavLink key={item.path} to={item.path} end={item.end} onClick={closeMenus}>{item.label}<ArrowUpRight size={16} /></NavLink>)}</nav>
        {isAuthenticated ? <div className="wz-mobile-account"><span className="wz-mobile-user">{user?.name || 'Community member'}</span><Link to={dashboardPath} onClick={closeMenus}>Your dashboard</Link><Link to="/profile" onClick={closeMenus}>Profile settings</Link><button onClick={signOut}>Sign out</button></div> : <div className="wz-mobile-auth"><Link to="/login" onClick={closeMenus}>Log in</Link><Link to="/register" onClick={closeMenus}>Create an account <ArrowUpRight size={16} /></Link></div>}
      </MotionDiv>}</AnimatePresence>
      <div className="wz-header-spacer" />
    </>
  );
}
