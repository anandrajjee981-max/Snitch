import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useproduct from '../hooks/useproduct';
import '../../../styles/productdetail.scss';

const Productdetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { handlesubmitvariant, handlegetproductbyid, handleeditvariantstock } = useproduct();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [selectedMainImg, setSelectedMainImg] = useState(0);

  // Form toggles and fields
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Variant Form state
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [stock, setStock] = useState(0);
  const [editingVariantStockId, setEditingVariantStockId] = useState(null);
  const [editVariantStockValue, setEditVariantStockValue] = useState("");
  const [attributes, setAttributes] = useState([{ key: 'Size', value: '' }]);
  const [images, setImages] = useState([]); // [{ file: File, preview: string }]

  const fileInputRef = useRef(null);

  // Fetch product data if missing or reloaded
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await handlegetproductbyid(id);
      if (res && res.product) {
        setProduct(res.product);
      }
    } catch (err) {
      console.error("Failed to load product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product?.productprice) {
      setPrice(product.productprice.price || '');
      setCurrency(product.productprice.currency || 'INR');
    }
  }, [product]);

  // Attribute Handlers
  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  // Image Upload Handlers
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFiles = (files) => {
    const fileList = Array.from(files);
    if (images.length + fileList.length > 7) {
      alert('Max 7 variant images allowed');
      return;
    }

    const newImages = fileList.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('price', price);
      formData.append('currency', currency);
      formData.append('stock', stock);

      // Build attribute key-value map
      const attrMap = {};
      attributes.forEach((item) => {
        if (item.key.trim() && item.value.trim()) {
          attrMap[item.key.trim()] = item.value.trim();
        }
      });

      formData.append('attribute', JSON.stringify(attrMap));
      formData.append('attributes', JSON.stringify(attrMap));

      // Append image files to FormData
      images.forEach((imgObj) => {
        if (imgObj.file) {
          formData.append('images', imgObj.file);
        }
      });

      const result = await handlesubmitvariant(product._id, formData);

      if (result && (result.save || result.product)) {
        const updatedProduct = result.save || result.product;
        setProduct(updatedProduct);
        setSuccessMsg('Variant added successfully!');
        
        // Reset form
        setImages([]);
        setAttributes([{ key: 'Size', value: '' }]);
        setShowForm(false);

        // Refresh product details
        fetchProductDetails();
      }
    } catch (err) {
      console.error("Error submitting variant:", err);
      setErrorMsg(err.response?.data?.message || 'Failed to add variant. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVariantStock = async (variantId) => {
    if (editVariantStockValue === '') return;
    try {
      const result = await handleeditvariantstock(product._id, variantId, { stock: Number(editVariantStockValue) });
      if (result) {
        setSuccessMsg('Variant stock updated successfully!');
        setEditingVariantStockId(null);
        fetchProductDetails();
      }
    } catch (err) {
      console.error("Error updating variant stock:", err);
      setErrorMsg(err.response?.data?.message || 'Failed to update variant stock.');
    }
  };

  if (loading) {
    return (
      <div className="product-detail-wrapper">
        <div className="detail-container">
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#7e6e65' }}>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-wrapper">
        <div className="detail-container">
          <button className="back-btn" onClick={() => navigate('/sellerproduct')}>
            &larr; Back to Products
          </button>
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#d9534f' }}>
            <h2>Product not found</h2>
          </div>
        </div>
      </div>
    );
  }

  const mainImages = product.image && product.image.length > 0 ? product.image : ['https://via.placeholder.com/400'];
  const variants = product.variants || [];

  return (
    <div className="product-detail-wrapper">
      <div className="detail-container">
        
        {/* Navigation Header */}
        <header className="detail-header">
          <button className="back-btn" onClick={() => navigate('/sellerproduct')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Products
          </button>
          <h1 className="page-title">Product Details</h1>
        </header>

        {/* Feedback Notifications */}
        {successMsg && (
          <div style={{ background: 'rgba(78, 54, 41, 0.08)', border: '1px solid #c3b091', color: '#4e3629', padding: '12px 20px', borderRadius: '16px', marginBottom: '20px', fontWeight: '600' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: 'rgba(217, 83, 79, 0.08)', border: '1px solid rgba(217, 83, 79, 0.3)', color: '#d9534f', padding: '12px 20px', borderRadius: '16px', marginBottom: '20px', fontWeight: '600' }}>
            {errorMsg}
          </div>
        )}

        {/* Main Product Info Card */}
        <div className="main-product-card">
          <div className="product-gallery">
            <div className="main-preview">
              <img src={mainImages[selectedMainImg]} alt={product.title} />
            </div>
            {mainImages.length > 1 && (
              <div className="thumbnails-row">
                {mainImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumb ${idx === selectedMainImg ? 'active' : ''}`}
                    onClick={() => setSelectedMainImg(idx)}
                  >
                    <img src={img} alt={`thumb-${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-details-content">
            <span className="badge">Base Product</span>
            <h2 className="title">{product.title}</h2>
            <div className="price-tag">
              <span className="currency">
                {product.productprice?.currency === 'INR' ? '₹' : product.productprice?.currency || '$'}
              </span>
              {product.productprice?.price || 0}
            </div>
            <p className="description">{product.description}</p>
            
            <div className="meta-info">
              <div className="meta-item">
                <span className="label">Product ID</span>
                <span className="value">{product._id}</span>
              </div>
              <div className="meta-item">
                <span className="label">Total Variants</span>
                <span className="value">{variants.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header & Toggle Button */}
        <div className="section-action-header">
          <h2 className="section-title">
            Product Variants 
            <span className="variant-count">{variants.length}</span>
          </h2>

          <button 
            className="add-variant-toggle-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <svg 
              className={`plus-icon ${showForm ? 'active' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {showForm ? 'Close Form' : 'Add Variant'}
          </button>
        </div>

        {/* Interactive Add Variant Form */}
        {showForm && (
          <form className="variant-form-card" onSubmit={handleFormSubmit}>
            <div className="form-header">
              <h3>Add New Variant</h3>
              <p>Specify variant attributes, pricing, stock levels, and upload images.</p>
            </div>

            <div className="form-grid">
              {/* Variant Price */}
              <div className="form-group">
                <label>Variant Price *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 299" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required 
                />
              </div>

              {/* Currency */}
              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="YEN">YEN (¥)</option>
                </select>
              </div>

              {/* Stock */}
              <div className="form-group">
                <label>Available Stock</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50" 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  min="0"
                />
              </div>
            </div>

            {/* Dynamic Attributes Section */}
            <div className="attributes-section">
              <div className="attr-header">
                <label>Variant Attributes (e.g. Size: M, Color: Beige)</label>
                <button 
                  type="button" 
                  className="add-attr-btn" 
                  onClick={handleAddAttribute}
                >
                  + Add Attribute
                </button>
              </div>

              {attributes.map((attr, idx) => (
                <div key={idx} className="attr-row">
                  <input 
                    type="text" 
                    placeholder="Attribute (e.g. Size)" 
                    value={attr.key} 
                    onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Value (e.g. XL or Red)" 
                    value={attr.value} 
                    onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                  />
                  {attributes.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-attr-btn" 
                      onClick={() => handleRemoveAttribute(idx)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Drag & Drop Image Uploader */}
            <div className="form-group">
              <label>Variant Images (Max 7)</label>
              
              <div 
                className={`drag-drop-zone ${isDragging ? 'dragging' : ''} ${images.length >= 7 ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div className="zone-content">
                  <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="zone-text">
                    <span className="cta-link">Click to upload variant images</span> or drag and drop
                  </p>
                  <span className="limit-subtitle">Up to 7 high resolution images ({images.length}/7 uploaded)</span>
                </div>
              </div>

              {/* Preview Grid */}
              {images.length > 0 && (
                <div className="preview-grid">
                  {images.map((imgItem, index) => (
                    <div key={index} className="preview-card">
                      <img src={imgItem.preview} alt={`preview-${index}`} />
                      <button 
                        type="button" 
                        className="remove-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Action Buttons */}
            <div className="form-submit-row">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={submitting}
              >
                {submitting ? 'Saving Variant...' : 'Save Variant'}
              </button>
            </div>
          </form>
        )}

        {/* Existing Variants Display Grid */}
        {variants.length > 0 ? (
          <div className="variants-grid">
            {variants.map((v, idx) => {
              // Extract attributes if Map or Object
              let attrEntries = [];
              if (v.attribute) {
                if (v.attribute instanceof Map) {
                  attrEntries = Array.from(v.attribute.entries());
                } else if (typeof v.attribute === 'object') {
                  attrEntries = Object.entries(v.attribute);
                }
              }

              const vImages = Array.isArray(v.images) ? v.images : [];

              return (
                <div key={v._id || idx} className="variant-card">
                  <div className="variant-media">
                    {vImages.length > 0 ? (
                      vImages.map((imgObj, i) => {
                        const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj?.url;
                        return (
                          <img 
                            key={i} 
                            src={imgUrl || 'https://via.placeholder.com/100'} 
                            alt={`variant-img-${i}`} 
                            className="v-img"
                          />
                        );
                      })
                    ) : (
                      <div className="no-v-img">No Image</div>
                    )}
                  </div>

                  <div className="variant-details">
                    <div className="v-price-row">
                      <span className="v-price">
                        {v.productprice?.currency === 'INR' ? '₹' : v.productprice?.currency || '$'}
                        {v.productprice?.price || product.productprice?.price || 0}
                      </span>
                      {editingVariantStockId === (v._id || idx) ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="number" 
                            value={editVariantStockValue} 
                            onChange={(e) => setEditVariantStockValue(e.target.value)} 
                            style={{ width: '60px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }} 
                            min="0"
                          />
                          <button onClick={() => handleUpdateVariantStock(v._id)} style={{ padding: '2px 8px', background: '#4e3629', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Save</button>
                          <button onClick={() => setEditingVariantStockId(null)} style={{ padding: '2px 8px', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                        </div>
                      ) : (
                        <span className={`v-stock ${v.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {v.stock > 0 ? `Stock: ${v.stock}` : 'Out of Stock'}
                          <button 
                            onClick={() => {
                              setEditingVariantStockId(v._id || idx);
                              setEditVariantStockValue(v.stock || 0);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px', color: '#666', display: 'inline-flex', alignItems: 'center' }}
                            title="Edit Stock"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </span>
                      )}
                    </div>

                    {attrEntries.length > 0 && (
                      <div className="attributes-chips">
                        {attrEntries.map(([key, val], i) => (
                          <div key={i} className="chip">
                            <strong>{key}:</strong> {val}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-variants-card">
            <p>No variants added for this product yet.</p>
            <p style={{ fontSize: '0.88rem', color: '#7e6e65' }}>
              Click on the <strong>+ Add Variant</strong> button above to configure sizes, colors, pricing, and stock.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Productdetail;
