import { Card, Text, Group, Badge, Image } from '@mantine/core';

interface FeedRestaurantCardProps {
  name: string;
  rating: number;
  priceRange: string;
  availableServices: ('Dine-In' | 'Pickup')[];
  specials?: string[];
  image?: string;
  onClick?: () => void;
}

export function FeedRestaurantCard({
  name,
  rating,
  priceRange,
  availableServices,
  specials = [],
  image,
  onClick,
}: FeedRestaurantCardProps) {
  return (
    <Card
      shadow="sm"
      radius="lg"
      withBorder
      style={{ cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      {image && <Image src={image} height={100} alt={name} radius="md" mb="sm" />}
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{name}</Text>
        <Group gap={4}>
          {availableServices.map((service) => (
            <Badge key={service} color={service === 'Dine-In' ? 'green' : 'blue'} variant="light">
              {service}
            </Badge>
          ))}
        </Group>
      </Group>
      <Group gap={8} mb="xs">
        <Badge color="yellow" variant="light">{rating.toFixed(1)}★</Badge>
        <Badge color="gray" variant="light">{priceRange}</Badge>
      </Group>
      <Group gap={4}>
        {specials.map((special) => (
          <Badge key={special} color="red" variant="filled" size="sm">
            {special}
          </Badge>
        ))}
      </Group>
    </Card>
  );
} 