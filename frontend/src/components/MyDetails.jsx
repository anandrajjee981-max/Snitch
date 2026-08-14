import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, CreditCard, Shield, Phone, Mail, Calendar, 
  CheckCircle2, Clock, XCircle, ArrowLeft, RefreshCw, 
  ShoppingBag, Copy, Check, ChevronDown, Sparkles, Receipt
} from 'lucide-react';
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
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Metrics
  const paidPayments = payments.filter((p) => p.status === 'paid');
  const totalSpent = paidPayments.reduce((sum, p) => sum + (p.amount ? p.amount / 100 : 0), 0);
  const paidCount = paidPayments.length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const avgOrderValue = paidCount > 0 ? (totalSpent / paidCount).toFixed(0) : 0;

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      (p.orderId && p.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.paymentId && p.paymentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id) => {
    setExpandedPaymentId(expandedPaymentId === id ? null : id);
  };

  return (
    <div className="snitch-mydetails-wrapper">
      <div className="snitch-mydetails-container glass-panel">
        
        {/* Navigation Bar Header */}
        <div className="snitch-top-nav-bar">
          <button className="btn-snitch-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} />
            <span>Storefront</span>
          </button>

          <div className="snitch-brand-badge">
            <Sparkles size={14} className="sparkle-gold" />
            <span>Highkeytees Account</span>
          </div>
        </div>

        {/* Highkeytees Warm Clay Hero Banner */}
        <motion.div 
          className="snitch-user-hero"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="hero-clay-glow" />

          <div className="hero-avatar-border">
            <div className="hero-avatar-box">
              <User size={38} />
            </div>
          </div>

          <div className="hero-user-details">
            <div className="hero-title-row">
              <h1 className="hero-username">{userInfo?.username || 'Valued Customer'}</h1>
              <span className={`snitch-role-badge role-${userInfo?.role || 'buyer'}`}>
                <Shield size={12} />
                {(userInfo?.role || 'buyer').toUpperCase()}
              </span>
            </div>

            <p className="hero-user-email">{userInfo?.email || 'No email associated'}</p>

            <div className="hero-info-chips">
              {userInfo?.phonenumber && (
                <div className="snitch-chip">
                  <Phone size={13} />
                  <span>+91 {userInfo.phonenumber}</span>
                </div>
              )}
              <div className="snitch-chip">
                <Calendar size={13} />
                <span>
                  Member since {userInfo?.createdAt ? new Date(userInfo.createdAt).getFullYear() : '2026'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Snitch Clay Segmented Tabs */}
        <div className="snitch-tab-switcher">
          <button
            className={`tab-btn-pill ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => handleTabChange('details')}
          >
            <User size={16} />
            <span>User Details</span>
          </button>
          <button
            className={`tab-btn-pill ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => handleTabChange('payments')}
          >
            <CreditCard size={16} />
            <span>Payment History</span>
            <span className="count-pill">{payments.length}</span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="snitch-tab-content"
          >
            <div className="snitch-details-grid">
              <div className="snitch-detail-card">
                <div className="card-icon-circle"><User size={20} /></div>
                <div className="card-info-copy">
                  <span className="info-label">Full Name / Username</span>
                  <p className="info-value">{userInfo?.username || 'Not Provided'}</p>
                </div>
              </div>

              <div className="snitch-detail-card">
                <div className="card-icon-circle"><Mail size={20} /></div>
                <div className="card-info-copy">
                  <span className="info-label">Email Address</span>
                  <p className="info-value">{userInfo?.email || 'Not Provided'}</p>
                </div>
              </div>

              <div className="snitch-detail-card">
                <div className="card-icon-circle"><Phone size={20} /></div>
                <div className="card-info-copy">
                  <span className="info-label">Phone Number</span>
                  <p className="info-value">{userInfo?.phonenumber ? `+91 ${userInfo.phonenumber}` : 'Not Provided'}</p>
                </div>
              </div>

              <div className="snitch-detail-card">
                <div className="card-icon-circle"><Shield size={20} /></div>
                <div className="card-info-copy">
                  <span className="info-label">Account Privilege</span>
                  <p className="info-value">{(userInfo?.role || 'BUYER').toUpperCase()}</p>
                </div>
              </div>

              <div className="snitch-detail-card">
                <div className="card-icon-circle"><ShoppingBag size={20} /></div>
                <div className="card-info-copy">
                  <span className="info-label">Completed Transactions</span>
                  <p className="info-value">{paidCount} Successful Payments</p>
                </div>
              </div>

              <div className="snitch-detail-card">
                <div className="card-icon-circle"><Receipt size={20} /></div>
                <div className="card-info-copy">
                  <span className="info-label">Total Amount Paid</span>
                  <p className="info-value">₹{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Payment History */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="snitch-tab-content"
          >
            {/* Visual Stat Cards */}
            <div className="snitch-stats-grid">
              <div className="snitch-stat-card total-spent-card">
                <div className="stat-card-header">
                  <span>Total Spent</span>
                  <div className="stat-icon-clay"><Receipt size={18} /></div>
                </div>
                <h2>₹{totalSpent.toLocaleString()}</h2>
                <span className="stat-subtext">Lifetime purchases</span>
              </div>

              <div className="snitch-stat-card">
                <div className="stat-card-header">
                  <span>Successful</span>
                  <div className="stat-icon-clay icon-emerald"><CheckCircle2 size={18} /></div>
                </div>
                <h2>{paidCount}</h2>
                <span className="stat-subtext">Verified orders</span>
              </div>

              <div className="snitch-stat-card">
                <div className="stat-card-header">
                  <span>Pending</span>
                  <div className="stat-icon-clay icon-warm"><Clock size={18} /></div>
                </div>
                <h2>{pendingCount}</h2>
                <span className="stat-subtext">In progress</span>
              </div>

              <div className="snitch-stat-card">
                <div className="stat-card-header">
                  <span>Average Order</span>
                  <div className="stat-icon-clay"><ShoppingBag size={18} /></div>
                </div>
                <h2>₹{Number(avgOrderValue).toLocaleString()}</h2>
                <span className="stat-subtext">Per transaction</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="snitch-filter-bar">
              <div className="search-box-wrap">
                <input
                  type="text"
                  placeholder="Search by Order ID or Payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="snitch-search-input"
                />
              </div>

              <div className="snitch-status-filter-pills">
                {['all', 'paid', 'pending', 'failed'].map((st) => (
                  <button
                    key={st}
                    className={`status-pill-btn ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st === 'all' ? 'All Orders' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>

              <button className="btn-snitch-refresh" onClick={fetchPayments} title="Refresh Transactions">
                <RefreshCw size={16} className={loadingPayments ? 'spin' : ''} />
              </button>
            </div>

            {/* Payment List Render */}
            {loadingPayments ? (
              <div className="snitch-state-box">
                <RefreshCw size={32} className="spin text-clay" />
                <p>Retrieving your payment details...</p>
              </div>
            ) : paymentsError ? (
              <div className="snitch-state-box">
                <XCircle size={36} className="text-danger" />
                <p>{paymentsError}</p>
                <button className="btn-snitch-action" onClick={fetchPayments}>Try Again</button>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="snitch-state-box">
                <CreditCard size={48} className="text-muted" />
                <h3>No Payment Records Found</h3>
                <p>{searchTerm || statusFilter !== 'all' ? 'No orders match your filter.' : 'You haven\'t completed any purchases yet.'}</p>
                <button className="btn-snitch-action" onClick={() => navigate('/dashboard')}>
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="snitch-payments-list">
                <AnimatePresence>
                  {filteredPayments.map((payment, index) => {
                    const isPaid = payment.status === 'paid';
                    const isPending = payment.status === 'pending';
                    const amountRupees = payment.amount ? payment.amount / 100 : 0;
                    const isExpanded = expandedPaymentId === (payment._id || payment.orderId);

                    return (
                      <motion.div
                        key={payment._id || payment.orderId || index}
                        className={`snitch-payment-card ${isPaid ? 'border-paid' : isPending ? 'border-pending' : 'border-failed'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        {/* Card Header Row */}
                        <div className="payment-header-row" onClick={() => toggleExpand(payment._id || payment.orderId)}>
                          <div className="payment-left-group">
                            <div className={`status-bubble ${payment.status}`}>
                              {isPaid ? <CheckCircle2 size={20} /> : isPending ? <Clock size={20} /> : <XCircle size={20} />}
                            </div>

                            <div className="payment-id-meta">
                              <div className="order-code-line">
                                <span className="lbl-order">ORDER</span>
                                <span className="val-code">{payment.orderId || 'N/A'}</span>
                                <button
                                  className="btn-copy-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(payment.orderId, payment.orderId);
                                  }}
                                  title="Copy Order ID"
                                >
                                  {copiedId === payment.orderId ? <Check size={12} className="text-check" /> : <Copy size={12} />}
                                </button>
                              </div>

                              <span className="payment-date">
                                {payment.createdAt
                                  ? new Date(payment.createdAt).toLocaleString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Recent'}
                              </span>
                            </div>
                          </div>

                          <div className="payment-right-group">
                            <div className="price-tag-wrap">
                              <span className="symbol">₹</span>
                              <span className="price">{amountRupees.toLocaleString()}</span>
                            </div>

                            <span className={`badge-status status-${payment.status}`}>
                              {payment.status.toUpperCase()}
                            </span>

                            <ChevronDown size={18} className={`caret-arrow ${isExpanded ? 'rotated' : ''}`} />
                          </div>
                        </div>

                        {/* Collapsible Details Drawer */}
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="payment-drawer-content"
                          >
                            <div className="drawer-hr" />
                            <div className="drawer-grid">
                              <div className="drawer-cell">
                                <span className="cell-label">Razorpay Payment ID</span>
                                <div className="cell-val-copy">
                                  <span>{payment.paymentId || 'Pending Verification'}</span>
                                  {payment.paymentId && (
                                    <button
                                      className="btn-copy-sm"
                                      onClick={() => copyToClipboard(payment.paymentId, payment.paymentId)}
                                    >
                                      {copiedId === payment.paymentId ? <Check size={12} className="text-check" /> : <Copy size={12} />}
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="drawer-cell">
                                <span className="cell-label">Currency & Gateway</span>
                                <span className="cell-val">{payment.currency || 'INR'} (Razorpay Checkout)</span>
                              </div>

                              <div className="drawer-cell">
                                <span className="cell-label">Signature Hash</span>
                                <span className="cell-val mono">{payment.signature ? `${payment.signature.slice(0, 16)}...` : 'N/A'}</span>
                              </div>

                              <div className="drawer-cell">
                                <span className="cell-label">Database Key</span>
                                <span className="cell-val mono">{payment._id}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
