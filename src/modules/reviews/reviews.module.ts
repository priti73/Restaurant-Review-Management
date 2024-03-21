// review.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { User } from '../user/user.entity';
import { Resturant } from '../resturant/entity/resturant.entity';
import { MenuItem } from '../resturant/entity/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review,Resturant,User,MenuItem]),
  JwtModule.register({ 
    secret: 'resturantapp', 
    signOptions: { expiresIn: '1h' }, 
  }),

],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
