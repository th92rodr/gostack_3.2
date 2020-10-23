import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const priceTotal = products.reduce((acc, current) => {
      return acc + current.price * current.quantity;
    }, 0);

    return formatValue(priceTotal);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    return products.reduce((acc, current) => {
      return acc + current.quantity;
    }, 0);
  }, [products]);

  return (
    <Container>
      <CartButton
        testID='navigate-to-cart-button'
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name='shopping-cart' size={24} color='#fff' />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
