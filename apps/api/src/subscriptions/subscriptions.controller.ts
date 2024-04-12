import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { SubscriptionsService } from './subscriptions.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor (private readonly subscriptionsService: SubscriptionsService, private readonly logger: Logger) {}

  @Post()
  async create (@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionsService.create(createSubscriptionDto)
  }

  @Get()
  async findAll () {
    return await this.subscriptionsService.findAll()
  }

  @Get(':id')
  async findOne (@Param('id') id: string) {
    return await this.subscriptionsService.findOne(+id)
  }

  @Patch(':id')
  async update (@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return await this.subscriptionsService.update(+id, updateSubscriptionDto)
  }

  @Delete(':id')
  async remove (@Param('id') id: string) {
    return await this.subscriptionsService.remove(+id)
  }
}
