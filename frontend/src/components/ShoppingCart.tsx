import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Popover,
  Stack,
  Text,
  Title,
  Divider,
} from '@mantine/core';
import { IconShoppingCart, IconX, IconPlus, IconMinus } from '@tabler/icons-react';
import { useLocation } from 'wouter';
import { useCart } from '../features/cart/hooks/useCart';
import { loadStripe } from '@stripe/stripe-js';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function ShoppingCart() {
  const [opened, { close, open }] = useDisclosure(false);
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart.items }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      await stripe?.redirectToCheckout({ sessionId });
      
      // Clear cart after successful checkout
      clearCart();
      close();
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={close}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="xl"
          onClick={open}
          pos="relative"
        >
          <IconShoppingCart size={20} />
          {cart.items.length > 0 && (
            <Badge
              size="xs"
              variant="filled"
              pos="absolute"
              top={-5}
              right={-5}
              color="red"
            >
              {cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0)}
            </Badge>
          )}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="sm" w={300}>
          <Group justify="space-between">
            <Title order={4}>Shopping Cart</Title>
            <Text size="sm" c="dimmed">
              {cart.items.length} items
            </Text>
          </Group>

          <Divider />

          {cart.items.length === 0 ? (
            <Text c="dimmed" ta="center" py="md">
              Your cart is empty
            </Text>
          ) : (
            <>
              {cart.items.map((item: CartItem) => (
                <Group key={item.id} justify="space-between" wrap="nowrap">
                  <Stack gap={0} style={{ flex: 1 }}>
                    <Text size="sm" fw={500} truncate>
                      {item.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ${item.price.toFixed(2)}
                    </Text>
                  </Stack>

                  <Group gap={5} wrap="nowrap">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <IconMinus size={14} />
                    </ActionIcon>
                    <Text size="sm">{item.quantity}</Text>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <IconPlus size={14} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      color="red"
                      variant="subtle"
                      onClick={() => removeItem(item.id)}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              ))}

              <Divider />

              <Group justify="space-between">
                <Text fw={500}>Subtotal</Text>
                <Text fw={500}>
                  ${cart.items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0).toFixed(2)}
                </Text>
              </Group>

              <Button
                fullWidth
                onClick={handleCheckout}
                disabled={cart.items.length === 0}
              >
                Checkout
              </Button>
            </>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
} 