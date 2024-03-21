
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enum/role.enum';
import { SetMetadata } from '@nestjs/common';
import { ResturantService } from '../service/resturant.service';
import { CreateResturantDto } from '../dto/resturant.dto';
import { restuarntDto } from '../dto/resturantlist.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


@Controller('restaurants')
export class ResturantController {
  constructor(private readonly restaurantsService: ResturantService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.BusinessOwner) 
  async createRestaurant(@Body() listingData: CreateResturantDto, @Req() req) {
    
    return this.restaurantsService.create(listingData, req.user.email);
  }
  

  @Get()
  findAllRestaurant(@Query() filters?: restuarntDto) {
    return this.restaurantsService.findAllRestaurant(filters);
  }

  @Get('/:id')
  findOneRestaurant(@Param('id') id: string,@Query() filters?: restuarntDto) {
    return this.restaurantsService.findRestaurantById(+id,filters);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.BusinessOwner) 
  updateRestaurant(@Param('id') id: string, @Body() listingData: CreateResturantDto, @Req() req) {
    return this.restaurantsService.updateRestaurant(+id, listingData,req.user.email);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin) 
  removeRestaurant(@Param('id') id: string) {
    return this.restaurantsService.removeRestaurant(+id);
  }
 
}


