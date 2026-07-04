import { Controller, Get } from '@nestjs/common';
import { StoriesService, type StoriesListResponse } from './stories.service';

@Controller('api/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  findAll(): StoriesListResponse {
    return this.storiesService.findAll();
  }
}
