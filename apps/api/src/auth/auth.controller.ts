import { Controller, Req, Get, UseGuards, Res } from '@nestjs/common'
import { Request, Response } from 'express'

import { GoogleOauthGuard } from './guards/google.guard'
import { AuthService } from './auth.service'
import { Profile } from './interfaces/profile'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleLogin () {
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleLoginCallback (@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signIn(req.user as Profile)

    res.cookie('access_token', token)

    return null
  }
}
