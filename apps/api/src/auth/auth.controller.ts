import { Controller, Request, Get, UseGuards } from '@nestjs/common'

import { GoogleOauthGuard } from './guards/google.guard'

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleLogin () {
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleLoginCallback (@Request() req: any) {
    return req.user
  }
}
