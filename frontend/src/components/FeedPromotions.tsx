import { Card, Text, Image, Group, ScrollArea } from '@mantine/core';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface FeedPromotionsProps {
  promotions: Promotion[];
}

export function FeedPromotions({ promotions }: FeedPromotionsProps) {
  return (
    <ScrollArea type="auto" scrollbarSize={6} style={{ marginBottom: 24 }}>
      <Group>
        {promotions.map((promo) => (
          <Card key={promo.id} shadow="sm" radius="lg" withBorder style={{ minWidth: 280 }}>
            {promo.image && (
              <Image src={promo.image} height={120} alt={promo.title} radius="md" mb="sm" />
            )}
            <Text fw={500}>{promo.title}</Text>
            <Text size="sm" c="dimmed">{promo.description}</Text>
          </Card>
        ))}
      </Group>
    </ScrollArea>
  );
} 