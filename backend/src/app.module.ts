import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductBriefsModule } from './product-briefs/product-briefs.module';
import { GeneratedContentModule } from './generated-content/generated-content.module';
import { PromptTemplatesModule } from './prompt-templates/prompt-templates.module';
import { TasksModule } from './tasks/tasks.module';
import { TrendsModule } from './trends/trends.module';
import { AiModule } from './ai/ai.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductBriefsModule,
    GeneratedContentModule,
    PromptTemplatesModule,
    TasksModule,
    TrendsModule,
    AiModule,
    DashboardModule,
  ],
})
export class AppModule {}
