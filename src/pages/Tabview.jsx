// src/pages/ManageProductTabs.jsx

import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ManageProducts from './ManageProducts';
import EditDeleteProducts from './EditDeleteProducts';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditNoteIcon from '@mui/icons-material/EditNote';

const ManageProductTabs = () => {
  const [selectedTab, setSelectedTab] = useState(location.state?.selectedTab || 0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', padding: 1 }}>
      <Tabs value={selectedTab} onChange={handleChange} aria-label="Product Tabs" textColor="#994ECC" // or "primary"
  indicatorColor="secondary" // changes the indicator line
  sx={{
    '& .MuiTab-root': {
      color: '#553C8B', // default text color
    },
    '& .Mui-selected': {
      color: '#553C8B', // selected tab label color
      fontWeight: 'bold',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#553C8B', // indicator line color
    },
  }}>
        <Tab label="Add Product"/>
        <Tab label="Edit/Delete Product"/>
      </Tabs>

      <Box sx={{ marginTop: 1 }}>
        {selectedTab === 0 && <ManageProducts />}
        {selectedTab === 1 && <EditDeleteProducts />}
      </Box>
    </Box>
  );
};

export default ManageProductTabs;
