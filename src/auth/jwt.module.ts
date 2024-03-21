// src/auth/jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'resturantapp', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [JwtStrategy,AuthService,JwtService],
})
export class JwtAuthModule {

}

