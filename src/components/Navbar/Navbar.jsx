import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Brain, Leaf, LogIn, ChevronDown, BookOpen } from 'lucide-react';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Products', path: '/products', icon: <ShoppingCart className="icon" /> },
    { name: 'Symptom Checker', path: '/symptom-checker', icon: <Heart className="icon" /> },
    { name: 'AI Recommendation', path: '/ai-recommendations', icon: <Brain className="icon" /> },
    { name: 'Plant Scanner', path: '/plant-scanner', icon: <Leaf className="icon" /> },
    { name: 'Research Hub', path: '/research', icon: <BookOpen className="icon" /> }, // Added Research Hub
  ];

  // Sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <NavLink to="/" className="logo">
        Herbal AI Hub
      </NavLink>

      <ul className={isOpen ? 'nav-links open' : 'nav-links'}>
        {navItems.map(item => (
          <li key={item.name}>
            <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}

        {/* Sign In / Sign Up Dropdown */}
        <li className="auth-dropdown">
          <span onClick={() => setAuthOpen(!authOpen)}>
            <LogIn className="icon" /> Account <ChevronDown className="icon-chevron" />
          </span>
          {authOpen && (
            <ul className="dropdown">
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Sign Up</NavLink>
              </li>
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
