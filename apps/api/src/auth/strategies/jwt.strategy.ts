import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { UsersService } from '../../users/users.service'
import { JwtPayload } from '../interfaces/jwt-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor (
    private readonly config: ConfigService,
    private readonly usersService: UsersService
  ) {
    const extractJwtFromCookie = (req: Request) => {
      let token = null
      if (req?.cookies) {
        token = req.cookies.access_token
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    }

    super({
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: extractJwtFromCookie
    })
  }

  async validate (payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub)

    if (!user) throw new UnauthorizedException('Please log in to continue')

    return {
      id: payload.sub,
      email: payload.email
    }
  }
}
