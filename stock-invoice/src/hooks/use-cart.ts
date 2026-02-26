import { useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  ref: string;
  libelle: string;
  prixVenteTTC: number;
  quantite: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { ...product, quantite: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantite: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalTTC = cart.reduce((sum, item) => sum + item.prixVenteTTC * item.quantite, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalTTC };
};