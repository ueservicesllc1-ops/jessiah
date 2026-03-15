import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Truck, CreditCard, CheckCircle, Upload } from 'lucide-react';
import { calculateShippingRates } from '../services/shippoService';
import emailjs from '@emailjs/browser';

const Cart = ({ onBack, cartItems, updateQuantity, removeItem, setCartItems }) => {
  // CONFIGURACIÓN EMAILJS
  const EMAILJS_PUBLIC_KEY = "krht8zO4i6DyD4jfC"; 
  const EMAILJS_SERVICE_ID = "service_5c1xzrr";
  const EMAILJS_TEMPLATE_ID = "template_wgy1ryj";

  const [step, setStep] = useState('cart'); // 'cart', 'info', 'shipping', 'payment', 'success'
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', zip: '', state: ''
  });
  
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [addressNotice, setAddressNotice] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = selectedRate ? selectedRate.price : 0;
  const total = subtotal + shippingCost;

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setStep('shipping');
    setIsLoadingShipping(true);
    const data = await calculateShippingRates(customerInfo, cartItems);
    
    // Check if we got the object or just a fallback array
    if (data.rates) {
      setShippingRates(data.rates);
      setSelectedRate(data.rates[0]);
      
      if (data.correctedAddress) {
        setAddressNotice(`Hemos optimizado tu dirección para asegurar la entrega: ${data.correctedAddress.address}, ${data.correctedAddress.city}`);
      } else {
        setAddressNotice(null);
      }
    } else {
      // Fallback
      setShippingRates(data);
      setSelectedRate(data[0]);
    }
    
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
      paymentProof: paymentProof ? URL.createObjectURL(paymentProof) : null 
    };

    // 2. Send to Admin
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
    } catch (err) { console.error("Error saving order:", err); }

    // 3. Send Email Confirmation
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
    } catch (error) {
      console.error("Error enviando email:", error);
    }

    // 4. WhatsApp
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
    window.open(waLink, '_blank');
  };

  return (
    <div className="cart-page">
      <section className="page-hero cart-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {step === 'cart' ? 'Tu Carrito' : step === 'info' ? 'Datos de Envío' : step === 'shipping' ? 'Método de Entrega' : step === 'payment' ? 'Finalizar Pago' : 'Confirmación'}
        </motion.h1>
      </section>

      <div className="cart-container container">
        <div className="cart-layout">
          <div className="cart-main-content">
            {step === 'cart' && (
              <div className="cart-items-list">
                <button className="back-btn" onClick={onBack}>
                  <ArrowLeft size={18} /> Continuar Comprando
                </button>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="cart-page-item">
                      <div className="item-img-wrap">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-category">{item.category}</p>
                        <div className="item-price-mobile">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="item-quantity">
                        <div className="quantity-box">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <div className="item-total">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <button className="item-remove" onClick={() => removeItem(item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-cart-view">
                    <ShoppingBag size={80} strokeWidth={1} />
                    <h2>Tu carrito está vacío</h2>
                    <p>Parece que aún no has añadido productos a tu carrito.</p>
                    <button className="btn-gold" onClick={onBack}>Ir a la Tienda</button>
                  </div>
                )}
              </div>
            )}

            {step === 'info' && (
              <div className="checkout-step">
                <button className="back-btn" onClick={() => setStep('cart')}>
                  <ArrowLeft size={18} /> Volver al Carrito
                </button>
                <form id="checkout-form" className="cart-checkout-form" onSubmit={handleInfoSubmit}>
                  <h2>Datos Personales</h2>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Nombre</label>
                      <input type="text" required value={customerInfo.firstName} onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>Apellido</label>
                      <input type="text" required value={customerInfo.lastName} onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})} />
                    </div>
                    <div className="input-group full">
                      <label>Email</label>
                      <input type="email" required value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
                    </div>
                    <div className="input-group full">
                      <label>Teléfono</label>
                      <input type="tel" required value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                    </div>
                  </div>
                  <h2 className="mt-40">Dirección de Envío</h2>
                  <div className="form-grid">
                    <div className="input-group full">
                      <label>Calle y Número</label>
                      <input type="text" required value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>Ciudad</label>
                      <input type="text" required value={customerInfo.city} onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>Estado</label>
                      <input type="text" required value={customerInfo.state} onChange={e => setCustomerInfo({...customerInfo, state: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>ZIP Code</label>
                      <input type="text" required value={customerInfo.zip} onChange={e => setCustomerInfo({...customerInfo, zip: e.target.value})} />
                    </div>
                  </div>
                </form>
              </div>
            )}

            {step === 'shipping' && (
              <div className="checkout-step">
                <button className="back-btn" onClick={() => setStep('info')}>
                  <ArrowLeft size={18} /> Volver a mis Datos
                </button>
                <h2>Selecciona un Método de Envío</h2>
                {isLoadingShipping ? (
                  <div className="cart-loader">
                    <div className="spinner"></div>
                    <p>Calculando tarifas USPS 2026...</p>
                  </div>
                ) : (
                  <>
                    {addressNotice && (
                      <div className="address-notice">
                        <CheckCircle size={16} color="#B4914A" />
                        <span>{addressNotice}</span>
                      </div>
                    )}
                    <div className="cart-rates-grid">
                      {shippingRates.map(rate => (
                        <div key={rate.id} className={`cart-rate-card ${selectedRate?.id === rate.id ? 'active' : ''}`} onClick={() => setSelectedRate(rate)}>
                          <div className="rate-check">
                            <div className="inner"></div>
                          </div>
                          <div className="rate-content">
                            <div className="rate-provider">
                              <Truck size={20} />
                              <strong>{rate.provider} - {rate.service}</strong>
                            </div>
                            <p>Entrega estimada en {rate.days} días hábiles.</p>
                          </div>
                          <div className="rate-price">${rate.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="checkout-step">
                <button className="back-btn" onClick={() => setStep('shipping')}>
                  <ArrowLeft size={18} /> Volver a Envío
                </button>
                <h2>Información de Pago</h2>
                <div className="cart-payment-view">
                   <div className="cart-zelle-info">
                      <div className="zelle-badge">Zelle</div>
                      <p>Para completar tu compra, realiza una transferencia a:</p>
                      <div className="zelle-data">
                         <strong>(929) 472-5986</strong>
                         <span>Nombre: Rachell Cabrera</span>
                      </div>
                   </div>

                   <div className="cart-upload-section">
                      <h3>Sube tu comprobante de pago</h3>
                      <p>Una vez realizado el depósito, sube una captura de pantalla aquí.</p>
                      <label className="cart-file-input">
                        {paymentProof ? (
                          <span className="file-name"><CheckCircle size={20}/> {paymentProof.name}</span>
                        ) : (
                          <><Upload size={24}/> Seleccionar Imagen</>
                        )}
                        <input type="file" accept="image/*" onChange={e => setPaymentProof(e.target.files[0])} />
                      </label>
                   </div>

                   <div className="dev-test-zone mt-30">
                      <p>🧪 PRUEBA RÁPIDA (MODO DEV):</p>
                      <button className="btn-outline" onClick={() => {
                        const blob = new Blob(["test"], { type: "text/plain" });
                        const file = new File([blob], "prueba.jpg", { type: "image/jpeg" });
                        setPaymentProof(file);
                        setTimeout(handleCheckout, 500);
                      }}>Saltar Subida y Probar Todo</button>
                   </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="cart-success-view">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="success-icon-wrap">
                  <CheckCircle size={100} />
                </motion.div>
                <h1>¡Pedido Realizado con Éxito!</h1>
                <p>Hemos recibido tus datos y el pedido ha sido procesado. Se ha enviado un correo de confirmación y serás redirigido a WhatsApp para finalizar el proceso.</p>
                <button className="btn-gold" onClick={onBack}>Volver a la Tienda</button>
              </div>
            )}
          </div>

          {step !== 'success' && cartItems.length > 0 && (
            <aside className="cart-summary-sidebar">
              <div className="summary-card">
                <h3>Resumen del Pedido</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Envío</span>
                    <span>{selectedRate ? `$${shippingCost.toFixed(2)}` : 'Calculado en el siguiente paso'}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {step === 'cart' && (
                  <button className="cart-action-btn" onClick={() => setStep('info')}>
                    Proceder al Pago <ArrowRight size={20} />
                  </button>
                )}
                {step === 'info' && (
                  <button className="cart-action-btn" form="checkout-form" type="submit">
                    Continuar al Envío <ArrowRight size={20} />
                  </button>
                )}
                {step === 'shipping' && (
                  <button className="cart-action-btn" onClick={() => setStep('payment')}>
                    Continuar al Pago <ArrowRight size={20} />
                  </button>
                )}
                {step === 'payment' && (
                  <button className="cart-action-btn finalize" onClick={handleCheckout} disabled={!paymentProof || isSubmitting}>
                    {isSubmitting ? 'Procesando...' : 'Finalizar y Enviar WhatsApp'} <ArrowRight size={20} />
                  </button>
                )}
              </div>
              <div className="cart-trust-badges">
                <div className="trust-item"><Truck size={16}/> Envío Seguro</div>
                <div className="trust-item"><CreditCard size={16}/> Pago Protegido</div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
