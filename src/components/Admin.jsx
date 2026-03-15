import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MessageSquare, ShoppingCart, Plus, Trash2, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../firebase/services';

const Admin = ({ onBack, t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [isUploading, setIsUploading] = useState(false);
  
  // States for forms
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    weight: '',
    description: '',
    category: 'Limpieza',
    image: null
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Data States
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'products') {
        const pData = await getProducts();
        setProducts(pData);
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const [mRes, oRes] = await Promise.all([
        fetch(`${API_URL}/api/messages`).catch(() => ({ json: () => [] })),
        fetch(`${API_URL}/api/orders`).catch(() => ({ json: () => [] }))
      ]);
      
      if (activeTab === 'messages') setMessages(await mRes.json());
      if (activeTab === 'orders') setOrders(await oRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '2014') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(t.error);
      setPin('');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, newProduct, newProduct.image);
        alert(t.success_update);
      } else {
        await addProduct(newProduct, newProduct.image);
        alert(t.success_add);
      }
      
      setNewProduct({ name: '', price: '', weight: '', description: '', category: 'Limpieza', image: null });
      setPreviewUrl(null);
      setEditingProduct(null);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      weight: product.weight || '',
      description: product.description || '',
      category: product.category,
      image: null
    });
    setPreviewUrl(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', weight: '', description: '', category: 'Limpieza', image: null });
    setPreviewUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm(t.delete_confirm)) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-logo">
            <span>JESSIAH</span>
            <small>SEGURIDAD</small>
          </div>
          <h2>{t.login_title}</h2>
          <p>{t.pin_placeholder}</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              maxLength={4}
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="admin-btn-primary">{t.enter}</button>
          </form>
          
          <button className="back-to-site" onClick={onBack}>{t.cancel}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>JESSIAH</span>
          <small>PANEL CONTROL</small>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            <span>{t.products}</span>
          </button>
          <button 
            className={activeTab === 'messages' ? 'active' : ''} 
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={20} />
            <span>{t.messages}</span>
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} />
            <span>{t.orders}</span>
          </button>
        </nav>

        <button className="admin-logout" onClick={onBack}>
          {t.logout}
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'products' ? t.products : activeTab === 'messages' ? t.messages : t.orders}</h1>
        </header>

        <section className="admin-content">
          {activeTab === 'products' && (
            <div className="admin-products-view">
              <div className="admin-card">
                <h3>{editingProduct ? t.edit : t.create}</h3>
                <form className="admin-form" onSubmit={handleProductSubmit}>
                  <div className="form-group">
                    <label>{t.name}</label>
                    <input 
                      type="text" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Ej. Serum Real" 
                      required 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.price} ($)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.weight} (lb)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                        placeholder="0.5" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.category}</label>
                      <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option>Limpieza</option>
                        <option>Hidratación</option>
                        <option>Tratamiento</option>
                        <option>Acabado</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t.description}</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="..." 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.image}</label>
                    <div className={`file-upload-zone ${previewUrl ? 'has-preview' : ''}`}>
                      {previewUrl ? (
                        <div className="image-preview-container">
                          <img src={previewUrl} alt="Vista previa" className="admin-img-preview" />
                          <button 
                            type="button" 
                            className="remove-preview"
                            onClick={() => {
                              setPreviewUrl(null);
                              setNewProduct({...newProduct, image: null});
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon size={24} />
                          <span>{t.image}</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="admin-btn-primary" disabled={isUploading}>
                      {isUploading ? (
                        <>...</>
                      ) : (
                        <>
                          {editingProduct ? <CheckCircle size={18} /> : <Plus size={18} />}
                          {editingProduct ? t.update : t.save}
                        </>
                      )}
                    </button>
                    {editingProduct && (
                      <button type="button" className="admin-btn-secondary" onClick={cancelEdit}>
                        {t.cancel}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-card mt-30">
                <h3>{t.existing}</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t.image}</th>
                      <th>{t.name}</th>
                      <th>{t.category}</th>
                      <th>{t.price}</th>
                      <th>{t.weight} (lb)</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-thumb">
                            <img src={p.image} alt={p.name} />
                          </div>
                        </td>
                        <td>{p.name}</td>
                        <td><span className="badge">{p.category}</span></td>
                        <td>${p.price}</td>
                        <td>{p.weight || '0'} lb</td>
                        <td>
                          <div className="admin-actions">
                            <button className="text-secondary" onClick={() => handleEditClick(p)}>{t.edit}</button>
                            <button className="text-danger" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="admin-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Remitente</th>
                    <th>Mensaje</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.name}</strong><br />
                        <small>{m.email}</small>
                      </td>
                      <td>{m.message}</td>
                      <td>{m.date}</td>
                      <td>
                        <button className="text-primary">Marcar Leído</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>${o.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${o.status.toLowerCase()}`}>
                          {o.status === 'Completado' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {o.status}
                        </span>
                      </td>
                      <td>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Admin;
