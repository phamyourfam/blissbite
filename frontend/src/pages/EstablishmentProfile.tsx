import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import {
  Container, Card, Group, Title, Text, Badge, Image, Tabs, SimpleGrid, Button, LoadingOverlay, Paper, Divider, ScrollArea, Avatar, Box, Grid, Stack
} from '@mantine/core';
import { IconMapPin, IconStar, IconChevronRight, IconInfoCircle, IconClock, IconEdit } from '@tabler/icons-react';
import { useGetEstablishmentQuery, useGetProductsQuery } from '../features/establishments/establishmentsApi';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useCart } from '../features/cart/hooks/useCart';

interface ProfessionalAccount {
  id: string;
}

interface Account {
  accountType: 'PERSONAL' | 'PROFESSIONAL';
  professionalAccount?: ProfessionalAccount;
}

interface Establishment {
  id: string;
  name: string;
  address: string;
  description?: string;
  professionalAccount?: ProfessionalAccount;
}

export default function EstablishmentProfile() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { account } = useAuth() as { account: Account | null };
  const { addItem } = useCart();
  const id = params.id;
  const { data: establishment, isLoading: loadingEst } = useGetEstablishmentQuery(id) as { data: Establishment | undefined, isLoading: boolean };
  const { data: products = [], isLoading: loadingProd } = useGetProductsQuery(id);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Extract unique categories from products if available
  const categories = ['All', ...Array.from(new Set(products.flatMap(p => p.categories?.map(c => c.name) || [])))];
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.categories?.some(c => c.name === activeCategory));

  if (loadingEst || !establishment) return <LoadingOverlay visible />;

  // Check if the current user is a professional account that owns this establishment
  const isOwner = account?.accountType === 'PROFESSIONAL' && establishment.professionalAccount?.id === account?.professionalAccount?.id;

  // Fallbacks for images and values
  const getImageUrl = (obj: any, fallback: string) => (obj && typeof obj.image_url === 'string' ? obj.image_url : fallback);
  const bannerImg = getImageUrl(establishment, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  const logoImg = getImageUrl(establishment, '/default-logo.png');
  const rating = 4.1; // Replace with real rating if available
  const priceRange = '£'; // Replace with real price range if available
  const cuisines = Array.isArray((establishment as any).cuisines) ? (establishment as any).cuisines : ['Fast food', 'Burgers', 'Chicken']; // Replace with real data if available
  const address = establishment.address || 'No address provided';
  const description = establishment.description || 'No description available.';
  const descShort = description.length > 160 && !showFullDesc ? description.slice(0, 160) + '...' : description;

  // Example reviews (replace with real data if available)
  const reviews = [
    {
      user: 'Macy S.',
      date: '2/12/23',
      rating: 5,
      text: 'Came quick and everything was lovely asked for burger plain tho and got everything on it and wish milkshakes was available.'
    },
    {
      user: 'alex C.',
      date: '15/02/24',
      rating: 4,
      text: "Because it's not McDonald's - Kensington. fire everyone in that gaff n make a KFC ta lad"
    }
  ];

  // Featured items (first 5 products)
  const featured = products.length > 0 ? products.slice(0, 5) : [
    { id: 'placeholder1', name: 'No featured items', description: '', base_price: 0, image_url: '', categories: [] }
  ];

  // Tabs onChange handler for string | null
  const handleTabChange = (value: string | null) => {
    setActiveCategory(value || 'All');
  };

  const handleAddToBasket = (product: any) => {
    if (!product || !product.id || !product.name || product.base_price === undefined) {
      console.error('Invalid product data:', product);
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.base_price
    });
  };

  const getProductImage = (product: any) => {
    return product.image_urls || product.image_url || '/default-product.jpg';
  };

  return (
    <Container style={{ background: '#f8f9fa', borderRadius: 16, minHeight: '100vh' }}>
      {/* Banner and Logo */}
      <Card shadow="md" radius="lg" mb="md" p={0} style={{ overflow: 'hidden', position: 'relative', height: 220 }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image 
            src={bannerImg} 
            alt="Banner" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        </div>
        <Avatar
          src={logoImg}
          size={96}
          radius={48}
          style={{
            position: 'absolute',
            left: 32,
            bottom: 16,
            border: '4px solid #fff',
            background: '#fff'
          }}
        />
        {isOwner && (
          <Button
            variant="light"
            color="blue"
            radius="md"
            leftSection={<IconEdit size={16} />}
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 2
            }}
            onClick={() => setLocation(`/establishments/${id}/settings`)}
          >
            Modify Establishment
          </Button>
        )}
      </Card>

      <Grid gutter="xl" align="flex-start">
        {/* Left/Main Column */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          {/* Header Info */}
          <Group align="flex-start" justify="space-between" mt={56} mb="md" wrap="wrap">
            <Box>
              <Title order={2}>{establishment.name || <Paper withBorder radius="md" p="xs" bg="gray.1" w={200}>No name</Paper>}</Title>
              <Group gap={8} mt={4}>
                <IconStar size={18} color="#FFD700" />
                <Text fw={700}>{rating}</Text>
                <Text c="dimmed">(15,000+ ratings)</Text>
                <Text c="dimmed">· {cuisines.length ? cuisines.join(', ') : 'No cuisines'} · {priceRange}</Text>
              </Group>
              <Text c="dimmed" size="sm" mt={4}>{address}</Text>
            </Box>
            <Group>
              <Badge color="green" variant="light" size="lg">Delivery</Badge>
              <Badge color="gray" variant="light" size="lg">Pick-up</Badge>
              <Badge color="dark" variant="light" size="lg">Group order</Badge>
            </Group>
          </Group>

          {/* Description */}
          <Text size="md" mb="md">
            {descShort}
            {description.length > 160 && (
              <Button variant="subtle" size="xs" ml={4} onClick={() => setShowFullDesc(v => !v)}>
                {showFullDesc ? 'Show less' : 'More'}
              </Button>
            )}
          </Text>

          {/* Rating and Reviews */}
          <Paper withBorder radius="md" p="md" mb="md">
            <Title order={4} mb="xs">Rating and reviews</Title>
            <Group align="center" gap={16} mb="xs">
              <Text fw={700} size="xl">{rating}</Text>
              <Group gap={2}>
                {[...Array(5)].map((_, i) => (
                  <IconStar key={i} size={18} color={i < Math.round(rating) ? '#FFD700' : '#eee'} />
                ))}
              </Group>
              <Text c="dimmed" size="sm">15,000+ ratings</Text>
            </Group>
            <Divider my="sm" />
            {reviews.length > 0 ? reviews.map((review, idx) => (
              <Box key={idx} mb="sm">
                <Text size="sm" fw={500}>{review.user} <Text span c="dimmed" size="xs">· {review.date}</Text></Text>
                <Text size="sm" c="dimmed" mb={2}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Text>
                <Text size="sm">{review.text}</Text>
              </Box>
            )) : <Text c="dimmed">No reviews yet.</Text>}
            <Button variant="subtle" rightSection={<IconChevronRight size={16} />} mt="xs">Show more</Button>
          </Paper>

          {/* Featured Items */}
          <Title order={4} mb="xs">Featured items</Title>
          <ScrollArea type="auto" scrollbarSize={6} mb="md">
            <Group gap="md" wrap="nowrap">
              {featured.map((product, i) => (
                <Card key={product.id} shadow="sm" radius="lg" withBorder style={{ minWidth: 220, position: 'relative' }}>
                  {i < 3 && product.name !== 'No featured items' && (
                    <Badge color="teal" variant="filled" style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>{`#${i + 1} most liked`}</Badge>
                  )}
                  <Card.Section>
                    <Image 
                      src={getProductImage(product)} 
                      height={120} 
                      alt={product.name}
                      fallbackSrc="/default-product.jpg"
                    />
                  </Card.Section>
                  <Text fw={500} mt="sm">{product.name || <Paper withBorder radius="md" p="xs" bg="gray.1">No name</Paper>}</Text>
                  <Text size="sm" c="dimmed" lineClamp={2}>{product.description || <Paper withBorder radius="md" p="xs" bg="gray.1">No description</Paper>}</Text>
                  <Text fw={700} mt="xs">{product.base_price ? `£${product.base_price.toFixed(2)}` : <Paper withBorder radius="md" p="xs" bg="gray.1">No price</Paper>}</Text>
                  <Button 
                    fullWidth 
                    mt="md" 
                    radius="md" 
                    variant="light" 
                    disabled={product.name === 'No featured items'}
                    onClick={() => handleAddToBasket(product)}
                  >
                    Add to Basket
                  </Button>
                </Card>
              ))}
            </Group>
          </ScrollArea>

          {/* Tabs for categories */}
          <Tabs value={activeCategory} onChange={handleTabChange} mb="md">
            <Tabs.List>
              {categories.map(cat => (
                <Tabs.Tab value={cat} key={cat}>{cat}</Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          {/* Product Grid */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {filteredProducts.length > 0 ? filteredProducts.map(product => (
              <Card key={product.id} shadow="sm" radius="lg" withBorder>
                <Card.Section>
                  <Image 
                    src={getProductImage(product)} 
                    height={140} 
                    alt={product.name}
                    fallbackSrc="/default-product.jpg"
                  />
                </Card.Section>
                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{product.name || <Paper withBorder radius="md" p="xs" bg="gray.1">No name</Paper>}</Text>
                  <Text fw={700}>{product.base_price ? `£${product.base_price.toFixed(2)}` : <Paper withBorder radius="md" p="xs" bg="gray.1">No price</Paper>}</Text>
                </Group>
                <Text size="sm" c="dimmed" lineClamp={2}>{product.description || <Paper withBorder radius="md" p="xs" bg="gray.1">No description</Paper>}</Text>
                <Button 
                  fullWidth 
                  mt="md" 
                  radius="md" 
                  variant="light"
                  onClick={() => handleAddToBasket(product)}
                >
                  Add to Basket
                </Button>
              </Card>
            )) : <Paper withBorder radius="md" p="xl" bg="gray.1" w="100%">No products available.</Paper>}
          </SimpleGrid>
          {loadingProd && <LoadingOverlay visible />}
        </Grid.Col>

        {/* Right/Info Column */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Paper withBorder radius="md" p="md">
              <Group gap={8}>
                <IconInfoCircle size={18} />
                <Text size="sm" fw={500} color="green">£0 delivery fee</Text>
              </Group>
              <Text size="xs" c="dimmed">Other fees</Text>
            </Paper>
            <Paper withBorder radius="md" p="md">
              <Group gap={8}>
                <IconClock size={18} />
                <Text size="sm" fw={500}>10 min</Text>
              </Group>
              <Text size="xs" c="dimmed">Earliest arrival</Text>
            </Paper>
            <Paper withBorder radius="md" p="md">
              <Group gap={8}>
                <IconMapPin size={18} />
                <div>
                  <Text fw={500}>{establishment.name || 'No name'}</Text>
                  <Text size="xs" c="dimmed">{address}</Text>
                  <Badge color="green" mt={4}>Open</Badge>
                </div>
              </Group>
              <Image src="/map-placeholder.png" height={80} mt={8} radius="md" alt="Map" />
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 