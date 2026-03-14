import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Truck, CreditCard, CheckCircle, Upload } from 'lucide-react';
import { calculateShippingRates } from '../services/shippoService';
import emailjs from '@emailjs/browser';

const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, removeItem, setCartItems }) => {
  // CONFIGURACIÓN EMAILJS
  const EMAILJS_PUBLIC_KEY = "krht8zO4i6DyD4jfC"; 
  const EMAILJS_SERVICE_ID = "service_5c1xzrr";
  const EMAILJS_TEMPLATE_ID = "template_wgy1ryj";

  const [step, setStep] = useState('cart'); // 'cart', 'info', 'payment', 'success'
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', zip: '', state: ''
  });
  
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = selectedRate ? selectedRate.price : 0;
  const total = subtotal + shippingCost;

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setStep('shipping');
    setIsLoadingShipping(true);
    const rates = await calculateShippingRates(customerInfo);
    setShippingRates(rates);
    setSelectedRate(rates[0]);
    setIsLoadingShipping(false);
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    // 1. Prepare Order Data
    const orderData = {
      customer: `${customerInfo.firstName} ${customerInfo.lastName}`,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}`,
      products: cartItems.map(i => `${i.name} (x${i.quantity})`).join(', '),
      subtotal,
      shipping: shippingCost,
      total,
      paymentProof: paymentProof ? URL.createObjectURL(paymentProof) : null // In real app, upload file first
    };

    // 2. Send to Admin (Mock API call)
    try {
      await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
    } catch (err) { console.error("Error saving order:", err); }

    // 3. Send Email Confirmation via EmailJS
    try {
      const templateParams = {
        to_name: orderData.customer,
        to_email: orderData.email,
        order_id: `ORD-${Date.now().toString().slice(-4)}`,
        total_amount: total.toFixed(2),
        shipping_address: orderData.address,
        products_list: orderData.products
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log("Email enviado con éxito!");
    } catch (error) {
      console.error("Error enviando email:", error);
    }

    // 4. Format WhatsApp Message
    const msg = `👑 *NUEVO PEDIDO JESSIAH* 👑\n\n` +
                `👤 *Cliente:* ${orderData.customer}\n` +
                `📧 *Email:* ${orderData.email}\n` +
                `📍 *Dirección:* ${orderData.address}\n\n` +
                `🛒 *Productos:*\n${orderData.products}\n\n` +
                `💰 *Subtotal:* $${subtotal.toFixed(2)}\n` +
                `🚚 *Envío:* $${shippingCost.toFixed(2)}\n` +
                `✨ *TOTAL:* $${total.toFixed(2)}\n\n` +
                `✅ *Pago:* Realizado vía Zelle.\n` +
                `📸 *Comprobante:* Adjunto en esta conversación.`;

    const waLink = `https://wa.me/19294725986?text=${encodeURIComponent(msg)}`;
    
    setIsSubmitting(false);
    setStep('success');
    
    // Open WhatsApp
    window.open(waLink, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          
          <motion.div className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            
            <div className="cart-header">
              <button className="cart-back" onClick={() => {
                if(step === 'info') setStep('cart');
                else if(step === 'shipping') setStep('info');
                else if(step === 'payment') setStep('shipping');
                else onClose();
              }}>
                {step === 'cart' ? <X size={20}/> : <ArrowLeft size={20} />}
              </button>
              <div className="cart-header-title">
                <span>{step === 'cart' ? 'Tu Carrito' : step === 'info' ? 'Envío' : step === 'shipping' ? 'Método de Envío' : step === 'payment' ? 'Pago' : '¡Éxito!'}</span>
              </div>
            </div>

            <div className="cart-content">
              {step === 'cart' && (
                <div className="cart-items-view">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={12} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={12} /></button>
                        </div>
                      </div>
                      <div className="cart-item-right">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                  {cartItems.length === 0 && <p className="empty">El carrito está vacío</p>}
                </div>
              )}

              {step === 'info' && (
                <form id="checkout-form" className="checkout-form" onSubmit={handleInfoSubmit}>
                  <h3>Datos del Cliente</h3>
                  <div className="form-row">
                    <input type="text" placeholder="Nombre" required value={customerInfo.firstName} onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})} />
                    <input type="text" placeholder="Apellido" required value={customerInfo.lastName} onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})} />
                  </div>
                  <input type="email" placeholder="Email" required value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
                  <input type="tel" placeholder="Teléfono" required value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <h3>Dirección de Envío</h3>
                  <input type="text" placeholder="Calle y Número" required value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                  <div className="form-row">
                    <input type="text" placeholder="Ciudad" required value={customerInfo.city} onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})} />
                    <input type="text" placeholder="Estado" required value={customerInfo.state} onChange={e => setCustomerInfo({...customerInfo, state: e.target.value})} />
                  </div>
                  <input type="text" placeholder="Código Postal (ZIP)" required value={customerInfo.zip} onChange={e => setCustomerInfo({...customerInfo, zip: e.target.value})} />
                </form>
              )}

              {step === 'shipping' && (
                <div className="shipping-view">
                  <h3>Tarifas Shippo Disponibles</h3>
                  {isLoadingShipping ? <div className="loader">Buscando mejores tarifas...</div> : (
                    <div className="rates-list">
                      {shippingRates.map(rate => (
                        <div key={rate.id} className={`rate-card ${selectedRate?.id === rate.id ? 'active' : ''}`} onClick={() => setSelectedRate(rate)}>
                          <div className="rate-info">
                            <Truck size={18} />
                            <div>
                              <strong>{rate.provider} - {rate.service}</strong>
                              <small>En {rate.days} días hábiles</small>
                            </div>
                          </div>
                          <span className="rate-price">${rate.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 'payment' && (
                <div className="payment-view">
                  <div className="zelle-box">
                    <div className="zelle-logo">Zelle</div>
                    <div className="zelle-details">
                      <p>Enviar pago a:</p>
                      <strong>+1 (888) 123-4567</strong>
                      <small>Nombre: Jessiah Hair Line LLC</small>
                    </div>
                  </div>
                  
                  <div className="upload-box">
                    <p>Sube tu comprobante de pago:</p>
                    <label className="file-label">
                      {paymentProof ? <span className="file-ready"><CheckCircle size={16}/> {paymentProof.name}</span> : <><Upload size={20}/> <span>Seleccionar Imagen</span></>}
                      <input type="file" accept="image/*" onChange={e => setPaymentProof(e.target.files[0])} />
                    </label>
                  </div>

                  <div className="test-zone" style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px', border: '1px dashed #ccc' }}>
                    <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px' }}>🧪 MODO DESARROLLADOR:</p>
                    <button 
                      className="btn-gold" 
                      style={{ width: '100%', padding: '10px', fontSize: '0.75rem' }}
                      onClick={() => {
                        // Create a fake file for testing
                        const blob = new Blob(["test content"], { type: "text/plain" });
                        const file = new File([blob], "comprobante_prueba.txt", { type: "text/plain" });
                        setPaymentProof(file);
                        setTimeout(handleCheckout, 500);
                      }}
                    >
                      Simular Compra y Probar Email
                    </button>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="success-view">
                  <CheckCircle size={60} className="success-icon" />
                  <h2>¡Pedido Solicitado!</h2>
                  <p>Hemos recibido tus datos. Serás redirigido a WhatsApp para finalizar el envío de tu comprobante.</p>
                  <button className="btn-gold" onClick={onClose}>Volver a la Tienda</button>
                </div>
              )}
            </div>

            {step !== 'success' && cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="summary">
                  <div className="summary-line"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                  {shippingCost > 0 && <div className="summary-line"><span>Envío (Shippo):</span><span>${shippingCost.toFixed(2)}</span></div>}
                  <div className="summary-line total"><span>Total:</span><span>${total.toFixed(2)}</span></div>
                </div>

                {step === 'cart' && <button className="checkout-btn" onClick={() => setStep('info')}>Proceder al Pago <ArrowRight size={18}/></button>}
                {step === 'info' && <button className="checkout-btn" form="checkout-form" type="submit">Continuar al Envío <ArrowRight size={18}/></button>}
                {step === 'shipping' && <button className="checkout-btn" onClick={() => setStep('payment')}>Continuar al Pago <CreditCard size={18}/></button>}
                {step === 'payment' && (
                  <button className="checkout-btn finish" onClick={handleCheckout} disabled={!paymentProof || isSubmitting}>
                    {isSubmitting ? 'Procesando...' : 'Finalizar y Enviar'} <ArrowRight size={18}/>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
