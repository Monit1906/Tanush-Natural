import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import './AdminStyles.css';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState('');

  const loadOrders = async () => {
    const data = await api.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleStatusChange = async (id, newStatus) => {
    await api.updateOrderStatus(id, newStatus);
    showToast(`Order ${id} status updated to ${newStatus}`);
    loadOrders();
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing': return <span className="status-badge status-warning"><Clock size={12} /> Processing</span>;
      case 'Shipped': return <span className="status-badge status-info"><Truck size={12} /> Shipped</span>;
      case 'Delivered': return <span className="status-badge status-active"><PackageCheck size={12} /> Delivered</span>;
      default: return <span className="status-badge status-draft">{status}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Orders & Commerce</h2>
          <p className="text-muted">Track customer orders, delivery fulfillment, and WhatsApp orders</p>
        </div>
      </div>

      <div className="admin-table-card glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Quick Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>
                  <div>{order.customer}</div>
                  <div className="text-muted text-xs">{order.phone}</div>
                </td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.items_count} items</td>
                <td><strong>₹{order.total}</strong></td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <select 
                    value={order.status} 
                    className="status-select-inline"
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManager;
