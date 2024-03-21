import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { User } from '../user/user.entity';
import { Resturant } from './entity/resturant.entity';
import { ResturantController } from './controller/resturant.controller';
import { ResturantService } from './service/resturant.service';
import { MenuItemController } from './controller/menu.controller';
import { MenuItem } from './entity/menu.entity';
import { MenuItemService } from './service/menu.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resturant, User,MenuItem]),
    JwtModule.register({ // Configure JwtModule with your options
      secret: 'resturantapp', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Example expiry time
    }),
  ],
  controllers: [ResturantController,MenuItemController ],
  providers: [ResturantService,MenuItemService],
})
export class ResturantModule {}
