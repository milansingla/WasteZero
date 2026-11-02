// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { Recycle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wz-site-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Recycle className="h-10 w-10 text-emerald-500" />
              <div>
                <h3 className="text-2xl font-bold text-white">WasteZero</h3>
                <p className="text-sm text-emerald-400">Towards Zero Waste</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              A community recycling platform focused on Rajpura and Banur, Punjab.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/locations" className="hover:text-emerald-400 transition-colors">Collection Points</Link></li>
              <li><Link to="/rewards" className="hover:text-emerald-400 transition-colors">Rewards</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">For Users</h4>
            <ul className="space-y-3">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Sign Up</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400 transition-colors">My Profile</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard/pickups" className="hover:text-emerald-400 transition-colors">My Pickups</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                <span>Rajpura and Banur, Punjab, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <span>+91 712 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <a href="mailto:vijayshikhareteam@gmail.com">vijayshikhareteam@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {currentYear} WasteZero. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-6">
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
