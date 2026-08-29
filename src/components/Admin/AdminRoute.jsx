import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminSkeleton } from '../Skeletons/Skeleton';

const AdminRoute = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <AdminSkeleton />;

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
