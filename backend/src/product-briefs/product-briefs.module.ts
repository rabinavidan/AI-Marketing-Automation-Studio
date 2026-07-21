import { Module } from '@nestjs/common';
import { ProductBriefsController } from './product-briefs.controller';
import { ProductBriefsService } from './product-briefs.service';

@Module({
  controllers: [ProductBriefsController],
  providers: [ProductBriefsService],
  exports: [ProductBriefsService],
})
export class ProductBriefsModule {}
