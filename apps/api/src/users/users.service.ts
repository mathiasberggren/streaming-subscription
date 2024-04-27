import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor (private readonly db: PrismaService) {}

  async create (createUserDto: CreateUserDto) {
    return await this.db.user.create({ data: createUserDto })
  }

  async findOrCreate (createUserDto: CreateUserDto) {
    return await this.db.user.upsert({
      where: { email: createUserDto.email },
      update: {},
      create: createUserDto
    })
  }

  async findAll () {
    return await this.db.user.findMany()
  }

  async findOne (id: number) {
    return await this.db.user.findUnique({
      where: { id }
    })
  }

  async update (id: number, data: UpdateUserDto) {
    return await this.db.user.update({
      where: { id },
      data
    })
  }

  async remove (id: number) {
    return await this.db.user.delete({
      where: { id }
    })
  }
}
