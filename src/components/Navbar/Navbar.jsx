import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Brain, Leaf, LogIn, ChevronDown, BookOpen } from 'lucide-react';
import userService from '../../services/userService';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Products', path: '/products', icon: <ShoppingCart className="icon" /> },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: <Heart className="icon" /> },
    { name: 'AI Recommendation', path: '/ai-recommendations', icon: <Brain className="icon" /> },
    { name: 'Plant Scanner', path: '/plant-scanner', icon: <Leaf className="icon" /> },
    { name: 'Research Hub', path: '/research', icon: <BookOpen className="icon" /> },
  ];

  // Sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await userService.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <NavLink to="/" className="logo">
        Herbal AI Hub
      </NavLink>

      <ul className={isOpen ? 'nav-links open' : 'nav-links'}>
        {navItems.map(item => {
          // Only show Research Hub if user has the right role
          if (item.name === 'Research Hub') {
            const role = user?.profile?.user_type || user?.user_type;
            const allowed = ['researcher','admin','herbalist'];
            if (!allowed.includes(role)) return null;
          }
          return (
            <li key={item.name}>
              <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                {item.icon} {item.name}
              </NavLink>
            </li>
          );
        })}

        {/* User Account Dropdown */}
        <li className="auth-dropdown">
          <span onClick={() => setAuthOpen(!authOpen)}>
            <LogIn className="icon" /> Account <ChevronDown className="icon-chevron" />
          </span>
          {authOpen && (
            <ul className="dropdown">
              {!user && (
                <>
                  <li>
                    <NavLink to="/login">Login</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register">Sign Up</NavLink>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    {user.profile?.avatar && (
                      <img src={user.profile.avatar} alt="avatar" className="navbar-avatar" />
                    )}
                    <span className="user-name">
                      Hello, {user.profile?.name || user.email} ({user.profile?.user_type})
                    </span>
                  </li>
                  {userService.isAdmin(user.profile) && (
                    <li>
                      <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
                    </li>
                  )}
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          )}
        </li>
      </ul>

      {/* Burger Menu for mobile */}
      <div className="burger" onClick={() => setIsOpen(!isOpen)}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
};

export default Navbar;