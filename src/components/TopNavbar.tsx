import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu, X, Orbit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopNavbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-bl from-black via-gray-900 to-indigo-950 bg-opacity-90 backdrop-blur border-b border-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 text-neon-blue font-orbitron text-xl font-bold tracking-widest">
          <Orbit size={28} className="text-neon-purple animate-spin-slow" />
          NEO Explorer
        </Link>
        {/* Right: User */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {user.photoURL && (
                <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full border-2 border-neon-blue shadow-neon" />
              )}
              <span className="hidden md:inline text-neon-blue font-semibold font-inter">{user.displayName || 'Explorer'}</span>
              <button onClick={handleSignOut} className="ml-2 px-2 py-1 rounded-lg bg-indigo-950/40 hover:bg-neon-purple/20 border border-neon-blue text-neon-blue hover:text-neon-purple transition-all flex items-center gap-1">
                <LogOut size={18} />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </>
          )}
        </div>
        {/* Mobile menu button (hidden since no nav links) */}
      </div>
    </header>
  );
} 