const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const calculateShippingRates = async (addressData, items) => {
  console.log("Calculando tarifas reales para:", addressData);
  
  try {
    const response = await fetch(`${API_URL}/api/shipping/rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addressData, items })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Error en Shippo");
    }

    const data = await response.json();
    return data; // Return full data { rates, correctedAddress }
  } catch (error) {
    console.error("Error obteniendo tarifas de Shippo:", error);
    // Mostrar alerta al usuario sobre la dirección
    alert("⚠️ " + error.message);
    
    // Solo devolvemos el fallback si es necesario, pero ahora el usuario sabe qué pasó
    return [
      { id: "fallback_1", provider: "Standard", service: "Envío Estándar (Contingencia)", price: 15.00, days: 5 }
    ];
  }
};
