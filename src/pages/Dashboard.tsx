import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './dashboard/DashboardHome';
import AddProperty from './dashboard/AddProperty';
import MyProperties from './dashboard/MyProperties';
import Favorites from './dashboard/Favorites';
import Settings from './dashboard/Settings';

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="add-property" element={<AddProperty />} />
      <Route path="my-properties" element={<MyProperties />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default Dashboard;
