import { Module } from '@nestjs/common';
import { GeneratedContentController } from './generated-content.controller';
import { GeneratedContentService } from './generated-content.service';

@Module({
  controllers: [GeneratedContentController],
  providers: [GeneratedContentService],
  exports: [GeneratedContentService],
})
export class GeneratedContentModule {}
