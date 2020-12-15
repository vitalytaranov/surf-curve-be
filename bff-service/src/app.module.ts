import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { GatewayService } from './gateway.service';


@Module({
  imports: [CacheModule.register({
    ttl: 120, // seconds
    max: 10, // maximum number of items in cache
  })],
  controllers: [AppController],
  providers: [
    GatewayService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
