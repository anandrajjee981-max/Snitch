import '../../../styles/productform.scss'
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import useproduct from '../hooks/useproduct';


const Productform = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'INR',
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const {handleaddproduct} = useproduct()

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // GSAP Entry Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.form-container',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }
      );
      gsap.fromTo(
        '.animate-field',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Drag and Drop Logic
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files) => {
    const fileList = Array.from(files);
    
    if (images.length + fileList.length > 7) {
      alert('Bhai, max 7 images hi allowed hain.');
      return;
    }

    const newImages = fileList.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (images.length === 0) {
    alert("Bhai, kam se kam ek product image upload karo!");
    return;
  }

  // 1. Create a FormData instance
  const dataToSend = new FormData();

  // 2. Append text fields
  dataToSend.append('title', formData.title);
  dataToSend.append('description', formData.description);
  dataToSend.append('price', formData.price);
  dataToSend.append('currency', formData.currency);

  // 3. Append your file objects
  // Note: 'images' is the key name your backend probably looks for (e.g., upload.array('images'))
  images.forEach((imgObj) => {
    dataToSend.append('images', imgObj.file); // imgObj.file contains the raw WebP file
  });

  // 4. Send the FormData instance to your hook
  const res = await handleaddproduct(dataToSend);
  
  // Your GSAP visual feedback
  gsap.to('.submit-btn', {
    scale: 0.96,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      alert('Product successfully published!');
    }
  });
};

  return (
    <div className="form-wrapper" ref={formRef}>
      <div className="form-container">
        
        <header className="form-header animate-field">
          <h2 className="form-title">Create Product</h2>
          <p className="form-subtitle">Fill out the details below to list your item globally.</p>
        </header>

        <form onSubmit={handleSubmit} className="product-form">
          
          {/* Row 1: Title */}
          <div className="form-group animate-field">
            <label htmlFor="title">Product Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Terracotta Ceramic Vase"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Row 2: Price & Currency Grouped */}
          <div className="price-currency-row animate-field">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <div className="select-wrapper">
                <select
                  id="currency"
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

          {/* Row 3: Description */}
          <div className="form-group animate-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Tell customers about the craftsmanship, style, and unique feel..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Row 4: Image Upload Block */}
          <div className="form-group animate-field">
            <label>Product Images <span className="label-count">({images.length}/7)</span></label>
            
            <div
              className={`drag-drop-zone ${isDragging ? 'dragging' : ''} ${images.length >= 7 ? 'disabled' : ''}`}
              onDragOver={images.length < 7 ? handleDragOver : undefined}
              onDragLeave={images.length < 7 ? handleDragLeave : undefined}
              onDrop={images.length < 7 ? handleDrop : undefined}
              onClick={images.length < 7 ? triggerFileInput : undefined}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                disabled={images.length >= 7}
              />
              <div className="zone-content">
                <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {images.length >= 7 ? (
                  <p className="zone-text">Storage Limit Reached</p>
                ) : (
                  <p className="zone-text">
                    <span className="desktop-only">Drag & drop images here or </span>
                    <span className="cta-link">Browse files</span>
                  </p>
                )}
                <span className="limit-subtitle">Supports PNG, JPG, JPEG (Max 7 files)</span>
              </div>
            </div>

            {/* Responsive Image Preview Grid */}
            {images.length > 0 && (
              <div className="preview-grid">
                {images.map((img, index) => (
                  <div key={index} className="preview-card">
                    <img src={img.preview} alt={`preview ${index}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button type="submit" className="submit-btn animate-field">
            Publish Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Productform;