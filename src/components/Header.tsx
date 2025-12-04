import { UserButton, useUser, SignInButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import './Css/header.css';

function Header() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "New", path: "/new" },
    { name: "Preowned", path: "/preowned" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="">
      <div className="hoverUnderLine flex justify-between items-center shadow-sm py-2 px-5">
        <Link to="/">
          <img src="/OneCarLogo.png" width={70} className="mr-2 md:mr-20" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10">
          {navItems.map((item) => (
            <li key={item.path} className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-blue-700">
              <a href={item.path} className={`relative ${location.pathname === item.path ? "active" : ""}`}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-5">
          {isSignedIn ? (
            <>
              <UserButton />
              <Link to="/profile">
                <Button className="hover:bg-blue-700 cursor-pointer">Submit Listing</Button>
              </Link>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={closeMobileMenu}
                    className={`block px-6 py-3 font-medium transition-colors ${location.pathname === item.path
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className={location.pathname === item.path ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold' : 'text-slate-700 dark:text-slate-300'}>
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            {isSignedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <UserButton />
                  <span className="text-sm font-medium">My Account</span>
                </div>
                <Link to="/profile" onClick={closeMobileMenu}>
                  <Button className="w-full hover:bg-blue-700 cursor-pointer">
                    Submit Listing
                  </Button>
                </Link>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full">Sign In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
