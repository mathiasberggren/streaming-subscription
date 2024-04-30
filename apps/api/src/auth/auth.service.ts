import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from '../users/users.service'

import { Profile } from './interfaces/profile'

@Injectable()
export class AuthService {
  constructor (private readonly usersService: UsersService, private readonly jwtService: JwtService) {
  }

  generateJwt (payload: object) {
    return this.jwtService.sign(payload)
  }

  // TODO: Implement ProfileDTO for improved validation
  async signIn (profile: Profile) {
    if (!profile) {
      throw new BadRequestException('Unauthenticated')
    }

    if (!profile.email) {
      throw new BadRequestException('Email not found')
    }

    const user = await this.usersService.findOrCreate({
      email: profile.email,
      name: profile.name,
      picture: profile.picture
    })

    return this.generateJwt({
      sub: user.id,
      email: user.email
    })
  }
}
