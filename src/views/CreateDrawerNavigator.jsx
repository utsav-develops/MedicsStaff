import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainDashboardScreen from './MainDashboardScreen'; // Adjust the import path as necessary
import DrawerContent from './DrawerContent'; // Adjust the import path as necessary

const DashboardDrawerNavigator = createDrawerNavigator();

const DashboardDrawer = () => {
  return (
    <DashboardDrawerNavigator.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <DashboardDrawerNavigator.Screen name="MainDashboard" component={MainDashboardScreen} />
      {/* Add other screens here if you want them to be part of the drawer navigation */}
    </DashboardDrawerNavigator.Navigator>
  );
};

export default DashboardDrawer;
