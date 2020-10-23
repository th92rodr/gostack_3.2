import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const products = await AsyncStorage.getItem('@GoMarketplace:products');

      if (products) {
        setProducts(JSON.parse(products));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (newProduct: Omit<Product, 'quantity'>) => {
      const hasFound = products.find(product => product.id === newProduct.id);

      if (hasFound) {
        increment(newProduct.id);
      } else {
        setProducts([
          ...products,
          {
            id: newProduct.id,
            image_url: newProduct.image_url,
            price: newProduct.price,
            title: newProduct.title,
            quantity: 1,
          },
        ]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [setProducts, products],
  );

  const increment = useCallback(
    async id => {
      setProducts(state => {
        return state.map(product => {
          if (product.id === id) {
            product.quantity++;
          }

          return product;
        });
      });

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [setProducts, products],
  );

  const decrement = useCallback(
    async id => {
      setProducts(state => {
        return state.map(product => {
          if (product.id === id && product.quantity > 0) {
            product.quantity--;
          }

          return product;
        });
      });

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [setProducts, products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
