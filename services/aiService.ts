
import { GoogleGenAI } from "@google/genai";
import { Transaction, Debt } from "../types";

const getClient = () => {
  try {
    // Safe access to process.env for browser environments
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Error initializing Gemini client:", e);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[], debts: Debt[]): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Configura tu API Key para recibir consejos personalizados de IA.";
  }

  // Limit to last 20 transactions to save tokens and keep context relevant
  const recent = transactions.slice(0, 20);
  
  const transactionsSummary = JSON.stringify(recent.map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date
  })));

  const today = new Date().getDate();

  const debtsSummary = JSON.stringify(debts.map(d => ({
    type: d.type, // payable (I owe) or receivable (They owe me)
    amount: d.amount,
    title: d.title,
    dueDate: d.dueDate,
    isCreditCard: d.isCreditCard,
    cutoffDay: d.cutoffDay,
    paymentDay: d.paymentDay
  })));

  const prompt = `
    Actúa como un asesor financiero experto y conciso. Hoy es el día ${today} del mes.
    
    Aquí están mis transacciones recientes (JSON): ${transactionsSummary}.
    
    Aquí está mi estado actual de deudas (JSON): ${debtsSummary}. 
    Si ves 'isCreditCard': true, presta atención a 'cutoffDay' (Corte) y 'paymentDay' (Pago límite).
    
    Analiza mi situación global y dame un consejo breve (máximo 3 oraciones) y procesable.
    
    REGLAS CLAVE:
    1. Si tengo tarjetas de crédito, sugiereme cuál usar hoy basándote en la fecha de corte (Estrategia: comprar justo después del corte da más días de financiamiento).
    2. Si alguna fecha de pago está cerca (próximos 5 días), adviérteme prioritaria mente.
    3. Si no tengo deudas urgentes, sugiere ahorro.
    
    Háblame de tú, sé directo y usa emojis financieros.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No pude generar un consejo en este momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error al conectar con el asesor financiero.";
  }
};
