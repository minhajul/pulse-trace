import { Controller, Get } from '@nestjs/common';
import { StoriesService } from './stories.service';

// Mounted at /api/stories because the top-level Vercel rewrite forwards
// the original request path. See vercel.json → rewrites.
@Controller('api/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  findAll() {
    return this.storiesService.findAll();
  }
}
