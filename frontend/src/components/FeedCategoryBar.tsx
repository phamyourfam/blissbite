import { ScrollArea, Group, Button } from '@mantine/core';
import { ReactNode } from 'react';

export interface Category {
  label: string;
  icon: ReactNode;
}

interface FeedCategoryBarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (label: string) => void;
}

export function FeedCategoryBar({ categories, selected, onSelect }: FeedCategoryBarProps) {
  return (
    <ScrollArea type="auto" scrollbarSize={6} style={{ marginBottom: 16 }}>
      <Group>
        {categories.map((cat) => (
          <Button
            key={cat.label}
            variant={selected === cat.label ? 'filled' : 'light'}
            leftSection={cat.icon}
            onClick={() => onSelect(cat.label)}
            radius="xl"
          >
            {cat.label}
          </Button>
        ))}
      </Group>
    </ScrollArea>
  );
} 