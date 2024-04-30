import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UsersModule } from '../users/users.module'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './strategies/google.strategy'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
