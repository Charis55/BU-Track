import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  Trophy, 
  Map as MapIcon,
  User
} from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bottom-nav glass-card">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/meals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Utensils size={20} />
        <span>Meals</span>
      </NavLink>
      <NavLink to="/workouts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Dumbbell size={20} />
        <span>Workouts</span>
      </NavLink>
      <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Trophy size={20} />
        <span>Ranks</span>
      </NavLink>
      <NavLink to="/campus" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MapIcon size={20} />
        <span>Guide</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
