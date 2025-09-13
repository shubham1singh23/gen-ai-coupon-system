import React from 'react';
import QRScanner from './QRScanner';

const AdminPage = () => {
  const handleQRCodeScanned = (data) => {
    // Handle the scanned QR code data
    console.log('Scanned QR Code:', data);
    // Add your admin-specific logic here
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="qr-scanner-container">
        
        <QRScanner onQRCodeScanned={handleQRCodeScanned} />
      </div>
    </div>
  );
};

export default AdminPage;