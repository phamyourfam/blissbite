import { Group, SegmentedControl, MultiSelect, Checkbox } from '@mantine/core';

interface FeedFilterBarProps {
  sort: string;
  onSortChange: (value: string) => void;
  dietary: string[];
  onDietaryChange: (value: string[]) => void;
  availableNow: boolean;
  onAvailableNowChange: (value: boolean) => void;
  dietaryOptions: { label: string; value: string }[];
}

export function FeedFilterBar({
  sort,
  onSortChange,
  dietary,
  onDietaryChange,
  availableNow,
  onAvailableNowChange,
  dietaryOptions,
}: FeedFilterBarProps) {
  return (
    <Group mb="md" gap="md">
      <SegmentedControl
        data={[
          { label: 'Highest Rated', value: 'highest-rated' },
          { label: 'Price', value: 'price' },
        ]}
        value={sort}
        onChange={onSortChange}
      />
      <MultiSelect
        data={dietaryOptions}
        placeholder="Dietary"
        value={dietary}
        onChange={onDietaryChange}
        clearable
        searchable
        style={{ minWidth: 180 }}
      />
      <Checkbox
        label="Available Now"
        checked={availableNow}
        onChange={e => onAvailableNowChange(e.currentTarget.checked)}
      />
    </Group>
  );
} 