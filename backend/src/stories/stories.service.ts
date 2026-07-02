import { Injectable } from '@nestjs/common';

export interface Story {
  id: number;
  title: string;
  author: string;
  content: string;
}

export interface StoriesListResponse {
  status: 'success';
  count: number;
  data: Story[];
  timestamp: string;
}

@Injectable()
export class StoriesService {
  private readonly stories: Story[] = [
    {
      id: 1,
      title: 'The Last Lighthouse Keeper',
      author: 'Elena Marsh',
      content:
        'For thirty years, Thomas watched the sea from his glass tower. Tonight, the light finally answered back.',
    },
    {
      id: 2,
      title: 'Coffee at the Edge of Time',
      author: 'Marcus Chen',
      content:
        'The cafe sits at the intersection of 5th and forever. I ordered a latte and got my past back.',
    },
    {
      id: 3,
      title: 'Static',
      author: 'Priya Nair',
      content:
        'The radio only picked up one frequency after the storm. On it, a voice reading a list of names — mine included.',
    },
    {
      id: 4,
      title: 'The Cartographer of Lost Cities',
      author: 'Hassan Okafor',
      content:
        'She drew maps of places that no longer existed, until one day, the maps drew her back.',
    },
    {
      id: 5,
      title: 'Apples for the Algorithm',
      author: 'Joon-ho Park',
      content:
        'The recommendation engine knew what I wanted before I did. What it did not know was why I had stopped wanting anything at all.',
    },
  ];

  findAll(): StoriesListResponse {
    return {
      status: 'success',
      count: this.stories.length,
      data: this.stories,
      timestamp: new Date().toISOString(),
    };
  }
}