import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfigAsync } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from './auth/jwt.module';
import { UsersModule } from './modules/user/user.module';
import {  ResturantModule } from './modules/resturant/resturant.module';
import { ReviewModule } from './modules/reviews/reviews.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeormConfigAsync), JwtAuthModule, UsersModule, ResturantModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
