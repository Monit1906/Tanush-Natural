import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { Shield, Clock, User, Activity } from 'lucide-react';
import './AdminStyles.css';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const data = await api.getAuditLogs();
      setLogs(data);
    };
    loadLogs();
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-header-actions">
        <div>
          <h2>Audit & Activity Log</h2>
          <p className="text-muted">Complete historical trail of CMS updates, product changes, and published content</p>
        </div>
      </div>

      <div className="admin-table-card glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action Description</th>
              <th>Entity</th>
              <th>Admin User</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                  No activity recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="text-sm">
                    <span className="flex-align-center gap-1">
                      <Clock size={14} className="text-muted" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td><strong>{log.action}</strong></td>
                  <td>
                    <span className="status-badge status-info">{log.entity}</span>
                  </td>
                  <td>
                    <span className="flex-align-center gap-1 text-sm">
                      <User size={14} className="text-muted" /> {log.admin}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
