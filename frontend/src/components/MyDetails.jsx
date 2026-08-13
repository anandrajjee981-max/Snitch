import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, CreditCard, Shield, Phone, Mail, Calendar, CheckCircle2, Clock, XCircle, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import usecart from '../cart/hooks/usecart';
import { getme } from '../auth/service/auth.api';
import { authSuccess } from '../auth/auth.slice';

export default function MyDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'details';
  const [activeTab, setActiveTab] = useState(activeTabParam);

  const reduxUser = useSelector((state) => state.auth?.user);
  const [userInfo, setUserInfo] = useState(reduxUser);

  const { getUserPaymentsApi } = usecart();
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentsError, setPaymentsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync tab with URL param
  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Fetch User Info if not in Redux
  useEffect(() => {
    if (!reduxUser) {
      getme()
        .then((res) => {
          if (res?.user) {
            setUserInfo(res.user);
            dispatch(authSuccess({ user: res.user, token: null }));
          }
        })
        .catch((err) => {
          console.error("Failed to load user info:", err);
        });
    } else {
      setUserInfo(reduxUser);
    }
  }, [reduxUser, dispatch]);

  // Fetch Payment History
  const fetchPayments = async () => {
    setLoadingPayments(true);
    setPaymentsError(null);
    try {
      const res = await getUserPaymentsApi();
      if (res?.payments) {
        setPayments(res.payments);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
      setPaymentsError(err.response?.data?.message || err.message || "Failed to load payment history");
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalSpent = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount ? p.amount / 100 : 0), 0);

  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  const filteredPayments = payments.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.orderId && p.orderId.toLowerCase().includes(q)) ||
      (p.paymentId && p.paymentId.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="status-badge status-paid">
            <CheckCircle2 size={14} /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge status-pending">
            <Clock size={14} /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="status-badge status-failed">
            <XCircle size={14} /> Failed
          </span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="mydetails-page-wrapper">
      <div className="mydetails-container glass-panel">
        {/* Page Top Header */}
        <div className="mydetails-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
            <span>Back to Shop</span>
          </button>
          <h2>My Account</h2>
        </div>

        {/* User Hero Summary */}
        <div className="user-hero-card">
          <div className="user-avatar-wrap">
            <User size={36} />
          </div>
          <div className="user-hero-info">
            <h3>{userInfo?.username || 'Valued Customer'}</h3>
            <p className="user-email">{userInfo?.email || 'No email provided'}</p>
            <div className="user-meta-tags">
              <span className="role-tag">
                <Shield size={12} />
                {(userInfo?.role || 'buyer').toUpperCase()}
              </span>
              {userInfo?.phonenumber && (
                <span className="phone-tag">
                  <Phone size={12} />
                  {userInfo.phonenumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mydetails-tabs">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => handleTabChange('details')}
          >
            <User size={16} />
            <span>User Details</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => handleTabChange('payments')}
          >
            <CreditCard size={16} />
            <span>Payment History ({payments.length})</span>
          </button>
        </div>

        {/* Tab Content 1: User Profile Details */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="tab-content profile-tab-content"
          >
            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-icon"><User size={20} /></div>
                <div className="detail-copy">
                  <label>Full Name / Username</label>
                  <p>{userInfo?.username || 'N/A'}</p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon"><Mail size={20} /></div>
                <div className="detail-copy">
                  <label>Email Address</label>
                  <p>{userInfo?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon"><Phone size={20} /></div>
                <div className="detail-copy">
                  <label>Mobile Number</label>
                  <p>{userInfo?.phonenumber ? String(userInfo.phonenumber) : 'Not provided'}</p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon"><Shield size={20} /></div>
                <div className="detail-copy">
                  <label>Account Role</label>
                  <p>{userInfo?.role ? userInfo.role.toUpperCase() : 'BUYER'}</p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon"><Calendar size={20} /></div>
                <div className="detail-copy">
                  <label>Member Since</label>
                  <p>
                    {userInfo?.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Recently Joined'}
                  </p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon"><ShoppingBag size={20} /></div>
                <div className="detail-copy">
                  <label>Total Completed Payments</label>
                  <p>{paidCount} Successful Orders</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content 2: Payment History */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="tab-content payments-tab-content"
          >
            {/* Payment Summary Metrics */}
            <div className="payment-metrics-row">
              <div className="metric-card">
                <span className="metric-label">Total Spent</span>
                <h4 className="metric-val">₹{totalSpent.toLocaleString()}</h4>
              </div>
              <div className="metric-card">
                <span className="metric-label">Total Orders</span>
                <h4 className="metric-val">{payments.length}</h4>
              </div>
              <div className="metric-card">
                <span className="metric-label">Successful</span>
                <h4 className="metric-val text-success">{paidCount}</h4>
              </div>
              <div className="metric-card">
                <span className="metric-label">Pending</span>
                <h4 className="metric-val text-amber">{pendingCount}</h4>
              </div>
            </div>

            {/* Filter and Refresh Bar */}
            <div className="payment-filter-bar">
              <input
                type="text"
                placeholder="Search order ID, payment ID or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-payment-input"
              />
              <button className="btn-refresh" onClick={fetchPayments} disabled={loadingPayments}>
                <RefreshCw size={16} className={loadingPayments ? 'spin-icon' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Payment Table / List */}
            {loadingPayments ? (
              <div className="payment-loading-state">
                <RefreshCw size={28} className="spin-icon" />
                <p>Loading your payment history...</p>
              </div>
            ) : paymentsError ? (
              <div className="payment-error-state">
                <p>{paymentsError}</p>
                <button className="btn-retry" onClick={fetchPayments}>Retry</button>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="payment-empty-state">
                <CreditCard size={48} />
                <h4>No Payments Found</h4>
                <p>
                  {searchTerm
                    ? 'No payment records matching your filter.'
                    : 'You haven\'t completed any orders yet.'}
                </p>
                <button className="btn-shop-now" onClick={() => navigate('/dashboard')}>
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="payment-table-wrapper">
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Payment ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id || payment.orderId}>
                        <td className="date-cell">
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </td>
                        <td className="mono-cell order-id-cell">
                          {payment.orderId || 'N/A'}
                        </td>
                        <td className="mono-cell payment-id-cell">
                          {payment.paymentId || '—'}
                        </td>
                        <td className="amount-cell">
                          ₹{(payment.amount ? payment.amount / 100 : 0).toLocaleString()}
                        </td>
                        <td>{getStatusBadge(payment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
