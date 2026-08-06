import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import useproduct from '../hooks/useproduct';
import '../../../styles/editproduct.scss';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { handlegetproductbyid, handleeditproduct } = useproduct();

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // Pre-fill from router state or fetch
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'INR',
    stock: '',
  });

  // Images: existing (from server) + new (local)
  const [existingImages, setExistingImages] = useState([]); // string URLs
  const [removedImages, setRemovedImages] = useState([]);   // URLs to remove
  const [newImages, setNewImages] = useState([]);            // { file, preview }
  const [isDragging, setIsDragging] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /* ─── Fetch product if not passed via state ─── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await handlegetproductbyid(id);
        if (res && res.product) setProduct(res.product);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    if (!product) load();
  }, [id]);

  /* ─── Prefill form when product arrives ─── */
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.productprice?.price || '',
        currency: product.productprice?.currency || 'INR',
        stock: product.stock ?? '',
      });
      setExistingImages(Array.isArray(product.image) ? product.image : []);
    }
  }, [product]);

  /* ─── GSAP entry animation ─── */
  useEffect(() => {
    if (!loading && formRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.edit-form-container',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out' }
        );
        gsap.fromTo(
          '.ep-animate',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', delay: 0.1 }
        );
      }, formRef);
      return () => ctx.revert();
    }
  }, [loading]);

  /* ─── Input handlers ─── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ─── Image handlers ─── */
  const totalImageCount = existingImages.length - removedImages.length + newImages.length;

  const processFiles = (files) => {
    const fileList = Array.from(files);
    if (totalImageCount + fileList.length > 7) {
      alert('Max 7 product images allowed in total.');
      return;
    }
    const mapped = fileList.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setNewImages((prev) => [...prev, ...mapped]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const toggleRemoveExisting = (url) => {
    setRemovedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const activeExisting = existingImages.filter((u) => !removedImages.includes(u));
    if (activeExisting.length + newImages.length === 0) {
      setErrorMsg('At least one product image is required.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('currency', formData.currency);
      data.append('stock', formData.stock || 0);

      // Tell the server which existing images to keep
      activeExisting.forEach((url) => data.append('keepImages', url));

      // Append new image files
      newImages.forEach((imgObj) => data.append('images', imgObj.file));

      const result = await handleeditproduct(id, data);

      setSuccessMsg('Product updated successfully!');

      // Animate success then go back
      gsap.to('.ep-submit-btn', {
        scale: 0.96,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setTimeout(() => navigate('/sellerproduct'), 1200);
        },
      });
    } catch (err) {
      console.error('Edit error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Loading / not found states ─── */
  if (loading) {
    return (
      <div className="ep-wrapper">
        <div className="ep-loading">
          <div className="ep-spinner" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="ep-wrapper">
        <div className="ep-loading">
          <p style={{ color: '#d9534f' }}>Product not found.</p>
          <button className="ep-back-btn" onClick={() => navigate('/sellerproduct')}>
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  const activeExisting = existingImages.filter((u) => !removedImages.includes(u));

  return (
    <div className="ep-wrapper" ref={formRef}>
      <div className="edit-form-container">

        {/* ── Header ── */}
        <header className="ep-header ep-animate">
          <button className="ep-back-btn" onClick={() => navigate('/sellerproduct')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Products
          </button>
          <div className="ep-title-group">
            <h1 className="ep-title">Edit Product</h1>
            <p className="ep-subtitle">Update your product details below.</p>
          </div>
        </header>

        {/* ── Feedback ── */}
        {successMsg && <div className="ep-alert ep-alert--success ep-animate">{successMsg}</div>}
        {errorMsg   && <div className="ep-alert ep-alert--error ep-animate">{errorMsg}</div>}

        <form className="ep-form" onSubmit={handleSubmit}>

          {/* ── Title ── */}
          <div className="ep-field ep-animate">
            <label htmlFor="ep-title">Product Title</label>
            <input
              id="ep-title"
              type="text"
              name="title"
              placeholder="e.g. Terracotta Ceramic Vase"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* ── Price · Currency ── */}
          <div className="ep-row ep-animate">
            <div className="ep-field">
              <label htmlFor="ep-price">Price</label>
              <input
                id="ep-price"
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div className="ep-field">
              <label htmlFor="ep-currency">Currency</label>
              <div className="ep-select-wrap">
                <select
                  id="ep-currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Stock ── */}
          <div className="ep-field ep-animate">
            <label htmlFor="ep-stock">
              Stock Quantity
              <span className="ep-label-hint">Current units available</span>
            </label>
            <div className="ep-stock-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ep-stock-icon">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <input
                id="ep-stock"
                type="number"
                name="stock"
                placeholder="e.g. 100"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          {/* ── Description ── */}
          <div className="ep-field ep-animate">
            <label htmlFor="ep-desc">Description</label>
            <textarea
              id="ep-desc"
              name="description"
              rows="4"
              placeholder="Tell customers about the craftsmanship, style, and unique feel..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* ── Images ── */}
          <div className="ep-field ep-animate">
            <label>
              Product Images
              <span className="ep-label-hint">{totalImageCount}/7 selected</span>
            </label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="ep-section-label">Current Images <span className="ep-section-hint">(click to mark for removal)</span></div>
            )}
            {existingImages.length > 0 && (
              <div className="ep-preview-grid ep-existing-grid">
                {existingImages.map((url, idx) => {
                  const removed = removedImages.includes(url);
                  return (
                    <div key={idx} className={`ep-preview-card ${removed ? 'ep-removed' : ''}`}>
                      <img src={url} alt={`existing-${idx}`} />
                      <button
                        type="button"
                        className={`ep-remove-btn ${removed ? 'ep-restore-btn' : ''}`}
                        onClick={() => toggleRemoveExisting(url)}
                        aria-label={removed ? 'Restore image' : 'Remove image'}
                        title={removed ? 'Click to restore' : 'Click to remove'}
                      >
                        {removed ? '↩' : '×'}
                      </button>
                      {removed && <div className="ep-removed-overlay">Removed</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Drag & Drop zone for new images */}
            {totalImageCount < 7 && (
              <>
                {existingImages.length > 0 && (
                  <div className="ep-section-label" style={{ marginTop: '16px' }}>Add New Images</div>
                )}
                <div
                  className={`ep-drop-zone ${isDragging ? 'ep-dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div className="ep-zone-content">
                    <svg xmlns="http://www.w3.org/2000/svg" className="ep-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="ep-zone-text">
                      <span className="ep-cta">Browse files</span> or drag & drop
                    </p>
                    <span className="ep-zone-hint">PNG, JPG, JPEG — up to {7 - totalImageCount} more</span>
                  </div>
                </div>
              </>
            )}

            {/* New image previews */}
            {newImages.length > 0 && (
              <>
                <div className="ep-section-label" style={{ marginTop: '12px' }}>New Uploads</div>
                <div className="ep-preview-grid">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="ep-preview-card">
                      <img src={img.preview} alt={`new-${idx}`} />
                      <button
                        type="button"
                        className="ep-remove-btn"
                        onClick={() => removeNewImage(idx)}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="ep-actions ep-animate">
            <button
              type="button"
              className="ep-cancel-btn"
              onClick={() => navigate('/sellerproduct')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ep-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
