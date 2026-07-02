import { Controller, Get } from '@nestjs/common';
import { StoriesService, StoriesListResponse } from './stories.service';

// Mounted at /api/stories because the top-level Vercel rewrite forwards
// the original request path. See vercel.json → rewrites.
@Controller('api/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  findAll(): StoriesListResponse {
    return this.storiesService.findAll();
  }
}
