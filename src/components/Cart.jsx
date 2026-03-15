import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Truck, CreditCard, CheckCircle, Upload } from 'lucide-react';
import { calculateShippingRates } from '../services/shippoService';
import emailjs from '@emailjs/browser';

const Cart = ({ onBack, cartItems, updateQuantity, removeItem, setCartItems, t }) => {
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
    
    if (data.rates) {
      setShippingRates(data.rates);
      setSelectedRate(data.rates[0]);
      if (data.correctedAddress) {
        setAddressNotice(t.address_optimized || `Hemos optimizado tu dirección: ${data.correctedAddress.address}`);
      } else {
        setAddressNotice(null);
      }
    } else {
      setShippingRates(data);
      setSelectedRate(data[0]);
    }
    setIsLoadingShipping(false);
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
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

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
    } catch (err) { console.error("Error saving order:", err); }

    try {
      const templateParams = {
        to_name: orderData.customer,
        to_email: orderData.email,
        order_id: `ORD-${Date.now().toString().slice(-4)}`,
        total_amount: total.toFixed(2),
        shipping_address: orderData.address,
        products_list: orderData.products
      };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    } catch (error) { console.error("Error sending email:", error); }

    const msg = `👑 *NUEVO PEDIDO JESSIAH* 👑\n\n` +
                `👤 *Cliente:* ${orderData.customer}\n` +
                `📧 *Email:* ${orderData.email}\n` +
                `📍 *Dirección:* ${orderData.address}\n\n` +
                `🛒 *Productos:*\n${orderData.products}\n\n` +
                `💰 *Subtotal:* $${subtotal.toFixed(2)}\n` +
                `🚚 *Envío:* $${shippingCost.toFixed(2)}\n` +
                `✨ *TOTAL:* $${total.toFixed(2)}`;

    const waLink = `https://wa.me/19294725986?text=${encodeURIComponent(msg)}`;
    setIsSubmitting(false);
    setStep('success');
    window.open(waLink, '_blank');
  };

  const getStepTitle = () => {
    if (step === 'cart') return t.title;
    if (step === 'info') return t.info;
    if (step === 'shipping') return t.shipping;
    if (step === 'payment') return t.payment;
    return t.success;
  };

  return (
    <div className="cart-page">
      <section className="page-hero cart-hero">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {getStepTitle()}
        </motion.h1>
      </section>

      <div className="cart-container container">
        <div className="cart-layout">
          <div className="cart-main-content">
            {step === 'cart' && (
              <div className="cart-items-list">
                <button className="back-btn" onClick={onBack}>
                  <ArrowLeft size={18} /> {t.back_shop}
                </button>
                {cartItems.length > 0 ? cartItems.map((item) => (
                  <div key={item.id} className="cart-page-item">
                    <div className="item-img-wrap"><img src={item.image} alt={item.name} /></div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <div className="item-price-mobile">${item.price.toFixed(2)}</div>
                      <div className="item-actions">
                        <div className="quantity-ctrl">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                          <span className="qty">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                        </div>
                        <button className="del-btn" onClick={() => removeItem(item.id)}><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="item-price-desktop">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                )) : (
                  <div className="empty-cart-view">
                    <ShoppingBag size={60} strokeWidth={1} />
                    <h2>{t.empty}</h2>
                    <p>{t.empty_desc}</p>
                    <button className="btn-gold" onClick={onBack}>{t.go_shop}</button>
                  </div>
                )}
              </div>
            )}

            {step === 'info' && (
              <div className="checkout-step">
                <button className="back-btn" onClick={() => setStep('cart')}><ArrowLeft size={18} /> {t.back_shop}</button>
                <h3>{t.personal_data}</h3>
                <form onSubmit={handleInfoSubmit} className="checkout-form">
                  <div className="form-row">
                    <input type="text" placeholder={t.first_name} required value={customerInfo.firstName} onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})} />
                    <input type="text" placeholder={t.last_name} required value={customerInfo.lastName} onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})} />
                  </div>
                  <input type="email" placeholder="Email" required value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                  <input type="tel" placeholder={t.phone} required value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <h3 style={{ marginTop: '30px' }}>{t.address_title}</h3>
                  <input type="text" placeholder={t.street} required value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
                  <div className="form-row">
                    <input type="text" placeholder={t.city} required value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} />
                    <input type="text" placeholder={t.state} required value={customerInfo.state} onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})} />
                    <input type="text" placeholder={t.zip} required value={customerInfo.zip} onChange={(e) => setCustomerInfo({...customerInfo, zip: e.target.value})} />
                  </div>
                  <button type="submit" className="btn-gold w-full mt-20">{t.continue_ship} <ArrowRight size={18} /></button>
                </form>
              </div>
            )}

            {step === 'shipping' && (
              <div className="checkout-step">
                <button className="back-btn" onClick={() => setStep('info')}><ArrowLeft size={18} /> {t.info}</button>
                <h3>{t.select_shipping}</h3>
                {addressNotice && <div className="address-notice"><Truck size={18} /><p>{addressNotice}</p></div>}
                <div className="shipping-options">
                  {isLoadingShipping ? <div className="loading-rates"><div className="spinner" /><p>{t.loading_rates}</p></div> :
                    shippingRates.map((rate) => (
                      <label key={rate.id} className={`shipping-card ${selectedRate?.id === rate.id ? 'selected' : ''}`}>
                        <input type="radio" name="shipping_rate" checked={selectedRate?.id === rate.id} onChange={() => setSelectedRate(rate)} />
                        <div className="rate-info">
                          <span className="rate-provider">{rate.provider} {rate.service}</span>
                          <span className="rate-days">{rate.days} business days</span>
                        </div>
                        <span className="rate-price">${rate.price.toFixed(2)}</span>
                      </label>
                    ))
                  }
                </div>
                <button className="btn-gold w-full mt-20" disabled={!selectedRate} onClick={() => setStep('payment')}>{t.continue_pay} <ArrowRight size={18} /></button>
              </div>
            )}

            {step === 'payment' && (
              <div className="checkout-step">
                <button className="back-btn" onClick={() => setStep('shipping')}><ArrowLeft size={18} /> {t.shipping}</button>
                <h3>{t.zelle_title}</h3>
                <div className="zelle-card">
                  <div className="zelle-logo">Zelle</div>
                  <p>{t.zelle_desc}</p>
                  <div className="zelle-details">
                    <div className="detail"><span>{t.first_name}:</span><strong>Rachell Cabrera</strong></div>
                    <div className="detail"><span>{t.phone}:</span><strong>(929) 472-5986</strong></div>
                  </div>
                </div>
                <div className="upload-section">
                  <h3>{t.upload_proof}</h3>
                  <p>{t.upload_desc}</p>
                  <label className="upload-box">
                    <input type="file" accept="image/*" onChange={(e) => setPaymentProof(e.target.files[0])} />
                    {paymentProof ? <div className="preview"><CheckCircle size={20} color="#c5a059" /><span>{paymentProof.name}</span></div> :
                      <div className="prompt"><Upload size={24} /><span>{t.select_img}</span></div>}
                  </label>
                </div>
                <button className="btn-gold w-full mt-20" disabled={!paymentProof || isSubmitting} onClick={handleCheckout}>
                  {isSubmitting ? t.processing : t.finalize}
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="success-step text-center">
                <div className="success-icon"><CheckCircle size={60} /></div>
                <h2>{t.success_title}</h2>
                <p>{t.success_desc}</p>
                <button className="btn-gold mt-20" onClick={() => { setCartItems([]); onBack(); }}>{t.back_shop}</button>
              </div>
            )}
          </div>

          {step !== 'success' && (
            <aside className="order-summary-card">
              <h3>{t.summary}</h3>
              <div className="summary-info">
                <div className="summary-row"><span>{t.subtotal}</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>{t.shipping}</span><span>{selectedRate ? `$${shippingCost.toFixed(2)}` : <small>{t.calc_next}</small>}</span></div>
                <div className="summary-divider" />
                <div className="summary-row total"><span>{t.total}</span><span>${total.toFixed(2)}</span></div>
              </div>
              {step === 'cart' && (
                <button className="btn-gold w-full mt-20" disabled={cartItems.length === 0} onClick={() => setStep('info')}>
                  {t.proced_payment} <ArrowRight size={18} />
                </button>
              )}
              <div className="trust-badges">
                <div className="badge"><Truck size={14} /> {t.trust_secure}</div>
                <div className="badge"><CreditCard size={14} /> {t.trust_payment}</div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
