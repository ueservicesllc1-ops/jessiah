export const calculateShippingRates = async (addressData) => {
  console.log("Calculando tarifas reales para:", addressData);
  
  try {
    const response = await fetch('http://localhost:3001/api/shipping/rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData)
    });

    if (!response.ok) throw new Error("Error en la respuesta de Shippo");

    const rates = await response.json();
    return rates;
  } catch (error) {
    console.error("Error obteniendo tarifas de Shippo:", error);
    // Fallback en caso de error para no bloquear la compra
    return [
      { id: "fallback_1", provider: "Standard", service: "Envío Estándar", price: 15.00, days: 5 }
    ];
  }
};
