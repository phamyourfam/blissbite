import { Card, Text, Image, Group, ScrollArea, Badge } from '@mantine/core';

export interface QuickPickEstablishment {
  id: string;
  name: string;
  averagePrepTime: number;
  image?: string;
}

interface FeedQuickPickProps {
  establishments: QuickPickEstablishment[];
  onSelect?: (id: string) => void;
}

export function FeedQuickPick({ establishments, onSelect }: FeedQuickPickProps) {
  return (
    <ScrollArea type="auto" scrollbarSize={6} style={{ marginBottom: 24 }}>
      <Group>
        {establishments.map((est) => (
          <Card
            key={est.id}
            shadow="sm"
            radius="lg"
            withBorder
            style={{ minWidth: 220, cursor: onSelect ? 'pointer' : undefined }}
            onClick={onSelect ? () => onSelect(est.id) : undefined}
          >
            {est.image && (
              <Image src={est.image} height={80} alt={est.name} radius="md" mb="sm" />
            )}
            <Text fw={500}>{est.name}</Text>
            <Badge color="yellow" mt="xs">
              Avg. Prep: {est.averagePrepTime} min
            </Badge>
          </Card>
        ))}
      </Group>
    </ScrollArea>
  );
} 