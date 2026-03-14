import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MessageSquare, ShoppingCart, Plus, Trash2, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';

const Admin = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [isUploading, setIsUploading] = useState(false);
  
  // States for forms
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Limpieza',
    image: null
  });

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
      const pRes = await fetch('http://localhost:3001/api/products').catch(() => ({ json: () => [] }));
      const mRes = await fetch('http://localhost:3001/api/messages');
      const oRes = await fetch('http://localhost:3001/api/orders');
      
      if (activeTab === 'products') setProducts(await pRes.json());
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
      setError('PIN Incorrecto. Intente de nuevo.');
      setPin('');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        alert("Producto creado con éxito");
        setNewProduct({ name: '', price: '', description: '', category: 'Limpieza', image: null });
        fetchData(); // Refresh list
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      try {
        await fetch(`http://localhost:3001/api/products/${id}`, { method: 'DELETE' });
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
          <h2>Panel de Administración</h2>
          <p>Por favor, introduzca su PIN de acceso.</p>
          
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
            <button type="submit" className="admin-btn-primary">Entrar</button>
          </form>
          
          <button className="back-to-site" onClick={onBack}>Cancelar</button>
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
            <span>Productos</span>
          </button>
          <button 
            className={activeTab === 'messages' ? 'active' : ''} 
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={20} />
            <span>Mensajes</span>
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} />
            <span>Órdenes</span>
          </button>
        </nav>

        <button className="admin-logout" onClick={onBack}>
          Volver al Sitio
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'products' ? 'Gestión de Productos' : activeTab === 'messages' ? 'Bandeja de Entrada' : 'Órdenes de Venta'}</h1>
        </header>

        <section className="admin-content">
          {activeTab === 'products' && (
            <div className="admin-products-view">
              <div className="admin-card">
                <h3>Crear Nuevo Producto</h3>
                <form className="admin-form" onSubmit={handleProductSubmit}>
                  <div className="form-group">
                    <label>Nombre del Producto</label>
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
                      <label>Precio ($)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Categoría</label>
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
                    <label>Descripción</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Describe los beneficios..." 
                    />
                  </div>
                  <div className="form-group">
                    <label>Imagen del Producto</label>
                    <div className="file-upload-zone">
                      <ImageIcon size={24} />
                      <span>Click para subir foto</span>
                      <input type="file" accept="image/*" />
                    </div>
                  </div>
                  <button type="submit" className="admin-btn-primary">
                    <Plus size={18} />
                    Guardar Producto
                  </button>
                </form>
              </div>

              <div className="admin-card mt-30">
                <h3>Productos Existentes</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td><span className="badge">{p.category}</span></td>
                        <td>${p.price}</td>
                        <td>
                          <button className="text-danger" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
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
