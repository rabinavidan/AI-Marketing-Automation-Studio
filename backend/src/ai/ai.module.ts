import { Module, Provider } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AI_SERVICE } from './ai-service.interface';
import { MockAIService } from './mock-ai.service';
import { OpenAIService } from './openai.service';

/**
 * Provider factory that binds the AI_SERVICE token to OpenAIService when
 * process.env.OPENAI_API_KEY is set, otherwise to MockAIService. Every
 * consumer (AiService, TrendsService, ...) injects the AI_SERVICE token and
 * is unaware of which concrete implementation is active.
 */
const aiServiceProvider: Provider = {
  provide: AI_SERVICE,
  useFactory: () => {
    if (process.env.OPENAI_API_KEY) {
      return new OpenAIService();
    }
    return new MockAIService();
  },
};

@Module({
  controllers: [AiController],
  providers: [AiService, aiServiceProvider],
  exports: [AiService, AI_SERVICE],
})
export class AiModule {}
