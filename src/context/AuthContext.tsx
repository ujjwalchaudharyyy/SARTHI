import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_OFFICER } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (officerId: string, pass: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  hasAccessToView: (viewId: string) => boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    'overview',
    'map',
    'surveillance',
    'challans',
    'rc_lookup',
    'register_vehicle',
    'speed',
    'disputes',
    'repeat',
    'stolen',
    'emergency',
    'incidents',
    'risk',
    'ai',
    'reports',
    'executive',
    'architecture',
    'security',
    'future',
    'team',
  ],
  TRAFFIC_OFFICER: [
    'overview',
    'map',
    'surveillance',
    'challans',
    'rc_lookup',
    'register_vehicle',
    'speed',
    'disputes',
    'repeat',
    'emergency',
    'incidents',
    'reports',
    'risk',
    'future',
    'team',
  ],
  POLICE_OFFICER: [
    'overview',
    'map',
    'surveillance',
    'challans',
    'rc_lookup',
    'stolen',
    'incidents',
    'speed',
    'disputes',
    'security',
    'reports',
    'future',
    'team',
  ],
  EMERGENCY_OPERATOR: [
    'overview',
    'map',
    'surveillance',
    'emergency',
    'incidents',
    'risk',
    'disputes',
    'reports',
    'future',
    'team',
  ],
  ANALYST: [
    'overview',
    'surveillance',
    'challans',
    'rc_lookup',
    'speed',
    'disputes',
    'repeat',
    'risk',
    'ai',
    'reports',
    'executive',
    'architecture',
    'future',
    'team',
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sarthi_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null; // Open on Login page first
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sarthi_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sarthi_auth_user');
    }
  }, [user]);

  const login = (officerId: string, pass: string, role: UserRole = 'SUPER_ADMIN'): boolean => {
    const validId = officerId.trim().toUpperCase() === 'DEMO001' || officerId.trim().length >= 4;
    const validPass = pass === 'demo123' || pass.length >= 4;

    if (validId && validPass) {
      const newUser: UserProfile = {
        id: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: officerId.toUpperCase() === 'DEMO001' ? 'Insp. R. S. Negi' : `Officer ${officerId}`,
        badgeId: officerId.toUpperCase(),
        role: role,
        department:
          role === 'POLICE_OFFICER'
            ? 'Uttarakhand State Police (Investigation Wing)'
            : role === 'EMERGENCY_OPERATOR'
            ? 'State Emergency Corridor Control (108 / ERSS)'
            : role === 'ANALYST'
            ? 'Traffic Analytics & Road Safety Directorate'
            : 'SARTHI — State Integrated Traffic Directorate',
        district: 'Nainital / Bhimtal Sector',
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
        department:
          newRole === 'POLICE_OFFICER'
            ? 'Uttarakhand State Police (Investigation Wing)'
            : newRole === 'EMERGENCY_OPERATOR'
            ? 'State Emergency Corridor Control (108 / ERSS)'
            : newRole === 'ANALYST'
            ? 'Traffic Analytics & Road Safety Directorate'
            : 'SARTHI — State Integrated Traffic Directorate',
      });
    }
  };

  const hasAccessToView = (viewId: string): boolean => {
    if (!user) return false;
    const allowed = ROLE_PERMISSIONS[user.role] || [];
    return allowed.includes(viewId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasAccessToView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
