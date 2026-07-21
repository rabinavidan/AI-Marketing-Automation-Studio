import { Controller, Get, Post } from '@nestjs/common';
import { TrendsService } from './trends.service';

@Controller('trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Get()
  findAll() {
    return this.trendsService.findAll();
  }

  @Post('generate')
  generate() {
    return this.trendsService.generate();
  }
}
