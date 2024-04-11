import { Logger, Module } from '@nestjs/common'

import { SubscriptionsService } from './subscriptions.service'
import { SubscriptionsController } from './subscriptions.controller'

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, Logger]
})
export class SubscriptionsModule {}
