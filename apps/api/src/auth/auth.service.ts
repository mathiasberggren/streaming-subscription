import { BadRequestException, Injectable } from '@nestjs/common'

import { UsersService } from '../users/users.service'

import { Profile } from './interfaces/profile'

@Injectable()
export class AuthService {
  constructor (private readonly usersService: UsersService) {
  }

  async signIn (user: Profile) {
    if (!user) {
      throw new BadRequestException('Unauthenticated')
    }

    const registeredUser = await this.usersService.findOneByEmail(user.email)

    if (!registeredUser) {
      return await this.register(user)
    }
  }

  async register (user: Profile) {
    return await this.usersService.create(user)
  }
}
