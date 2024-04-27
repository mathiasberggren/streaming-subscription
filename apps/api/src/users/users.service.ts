import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'

@Injectable()
export class UsersService {
  constructor (private readonly db: PrismaService) {}

  async findByEmail (email: string) {
    return await this.db.user.findUnique({
      where: { email }
    })
  }
}
