import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const item = window.localStorage.getItem('tanush_wishlist');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('tanush_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error(error);
    }
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    setWishlistItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.filter(item => item.id !== product.id);
      }
      return [...prevItems, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
