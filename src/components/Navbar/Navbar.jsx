import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px 0 10px 0',
      border: 'none',
      lineHeight: 'normal'
    }}>
      {/* Top Navigation */}
      <div className="top-nav" style={{ margin: 0, padding: 0 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Link className="navbar-brand" to="/">
              <i className="fas fa-leaf me-2"></i>HerbalMarket <br />
              <small className="text-muted ms-2 d-none d-md-inline">Natural Wellness</small>
            </Link>

            <div className="d-flex nav-search me-3" style={{ width: '50%' }}>
              <input className="form-control border-0" type="search" placeholder="What are you looking for?"
                aria-label="Search" />
              <button className="btn btn-green px-3" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>

            <div className="d-flex align-items-center">
              <Link to="/cart" className="cart-icon me-3 text-decoration-none text-dark">
                <i className="fas fa-shopping-cart fa-lg"></i>
                <span className="cart-count">3</span>
              </Link>
              <Link to="/login" className="btn btn-green btn-sm me-2">
                <i className="fas fa-user me-1"></i> Sign In
              </Link>

              <Link to="/register" className="btn btn-outline-secondary btn-sm me-4">
                <i className="fas fa-user-plus me-1"></i> Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-black" style={{ borderBottom: '1px solid #33e407' }}>
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item" style={{ fontSize: '200px' }}>
                <Link className="nav-link" to="/">
                  <i className="fas fa-home me-1"></i> Home
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link" to="/products">
                  <i className="fas fa-seedling me-1"></i> Products
                </Link>
                <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                  <li><Link className="dropdown-item" to="/products">Medicinal Herbs</Link></li>
                  <li><Link className="dropdown-item" to="/products">Essential Oils</Link></li>
                  <li><Link className="dropdown-item" to="/products">Herbal Teas</Link></li>
                  <li><Link className="dropdown-item" to="/products">Natural Supplements</Link></li>
                  <li><Link className="dropdown-item" to="/products">Skincare Products</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/plant-scanner">
                  <i className="fas fa-camera me-1"></i> Plant Scanner
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/symptom-checker">
                  <i className="fas fa-stethoscope me-1"></i> Symptom Checker
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ai-recommendations">
                  <i className="fas fa-robot me-1"></i> AI Recommendations
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* <p style={{ textAlign: 'center', color: 'white',backgroundColor: 'black',paddingTop: '20px',paddingBottom: '0px', fontWeight: 'bold', borderBottom: '1px solid #33e407' }}>
        Learn, Treat, Research and Heal with the best HerbalMarket
      </p> */}

      <style jsx>{`
        .navbar-brand {
          color: #2E7D32 !important;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .top-nav {
          background-color: #f8f8f8;
          border-bottom: 1px solid #33e407;
          padding: 8px 0;
        }

        .nav-search {
          border: 2px solid #4CAF50;
          border-radius: 4px;
        }

        .nav-search .form-control:focus {
          box-shadow: none;
          border-color: #4CAF50;
        }

        .btn-green {
          background-color: #4CAF50;
          color: white;
        }

        .btn-green:hover {
          background-color: #2E7D32;
          color: white;
        }

        .nav-item {
          font-weight: bold;
          margin-left: 50px;
        }

        .nav-link {
          color: #666;
          font-size: 20px;
          padding: 0.9rem 1.0rem;
        }

        .nav-link:hover {
          color: #4CAF50;
        }

        .bottom-nav {
          background-color: white;
          padding: 8px 0;
        }

        .bottom-nav-link {
          color: #999;
          font-size: 0.85rem;
          padding: 0.3rem 0.8rem;
        }

        .bottom-nav-link:hover {
          color: #4CAF50;
        }

        .dropdown:hover .dropdown-menu {
          display: block;
          margin-top: 0;
        }

        .cart-icon {
          position: relative;
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #ff6b6b;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
