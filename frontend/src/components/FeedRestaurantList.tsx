import { Grid } from '@mantine/core';
import { FeedRestaurantCard } from './FeedRestaurantCard';

export interface FeedRestaurantListItem {
  id: string;
  name: string;
  rating: number;
  priceRange: string;
  availableServices: ('Dine-In' | 'Pickup')[];
  specials?: string[];
  image?: string;
}

interface FeedRestaurantListProps {
  restaurants: FeedRestaurantListItem[];
  onCardClick?: (id: string) => void;
}

const mockRestaurants: FeedRestaurantListItem[] = [
  {
    id: '1',
    name: 'The Gourmet Kitchen',
    rating: 4.5,
    priceRange: '$$$',
    availableServices: ['Dine-In', 'Pickup'],
    specials: ['Happy Hour 4-6pm', 'Weekend Brunch'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: 'Sushi Paradise',
    rating: 4.8,
    priceRange: '$$$$',
    availableServices: ['Dine-In'],
    specials: ['All-You-Can-Eat Sushi'],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3'
  },
  {
    id: '3',
    name: 'Burger Joint',
    rating: 4.2,
    priceRange: '$$',
    availableServices: ['Dine-In', 'Pickup'],
    specials: ['Buy One Get One Free on Tuesdays'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3'
  },
  {
    id: '4',
    name: 'Pasta Palace',
    rating: 4.6,
    priceRange: '$$$',
    availableServices: ['Dine-In', 'Pickup'],
    specials: ['Wine Wednesday'],
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3'
  },
  {
    id: '5',
    name: 'Pizza Heaven',
    rating: 4.7,
    priceRange: '$$',
    availableServices: ['Dine-In', 'Pickup'],
    specials: ['Family Size Special'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3'
  }
];

export function FeedRestaurantList({ restaurants = mockRestaurants, onCardClick }: FeedRestaurantListProps) {
  return (
    <Grid>
      {[...mockRestaurants, ...restaurants].map((rest) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={rest.id}>
          <FeedRestaurantCard
            name={rest.name}
            rating={rest.rating}
            priceRange={rest.priceRange}
            availableServices={rest.availableServices}
            specials={rest.specials}
            image={rest.image}
            onClick={onCardClick ? () => onCardClick(rest.id) : undefined}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
} 