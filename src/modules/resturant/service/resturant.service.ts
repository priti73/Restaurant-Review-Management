// business-listings.service.ts
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
import { Resturant } from '../entity/resturant.entity';
import { CreateResturantDto } from '../dto/resturant.dto';
import { restuarntDto } from '../dto/resturantlist.dto';

@Injectable()
export class ResturantService {
  constructor(
    @InjectRepository(Resturant)
    private readonly restaurantsRepo: Repository<Resturant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(listingData: CreateResturantDto, email: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const restaurant = this.restaurantsRepo.create({
        ...listingData,
        createdBy: user,
      });
      await this.restaurantsRepo.save(restaurant);
      return {
        status: 201,
        message: 'restaurant created successfully',
        data: restaurant,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllRestaurant(filters: restuarntDto) {
    try {
      const { name, orderBy, orderId, skip, take } = filters;

      const queryBuilder = this.restaurantsRepo
        .createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.menuItems', 'menuItem');

      if (name) {
        queryBuilder.where('restaurant.name ILIKE :name', { name: `%${name}%` });
      }

      const orderField = orderBy || 'id';
      const orderDirection = orderId || 'ASC';
      queryBuilder.orderBy(`restaurant.${orderField}`, orderDirection);

      if (skip !== undefined) {
        queryBuilder.offset(skip);
      }
      if (take !== undefined) {
        queryBuilder.limit(take);
      }
      const restaurantList = await queryBuilder.getMany();

      return {
        status: 200,
        message: 'restaurant list fetched successfully',
        data: restaurantList,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findRestaurantById(id: number,filters: restuarntDto) {
    try{
    const { name, orderBy, orderId, skip, take } = filters;

      const queryBuilder = this.restaurantsRepo
        .createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.menuItems', 'menuItem')
          .andWhere('restaurant.id = :restaurantId', {restaurantId:id });
      if (name) {
        queryBuilder.where('menuItem.name ILIKE :name', { name: `%${name}%` });
      }

      const orderField = orderBy || 'price';
      const orderDirection = orderId || 'ASC';
      queryBuilder.orderBy(`menuItem.${orderField}`, orderDirection);

      if (skip !== undefined) {
        queryBuilder.offset(skip);
      }
      if (take !== undefined) {
        queryBuilder.limit(take);
      }
      const restaurantDetails = await queryBuilder.getMany();

      return {
        status: 200,
        message: 'restaurant details fetched successfully',
        data: restaurantDetails,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

  }

  async updateRestaurant(restaurantId: number, restaurantDto:CreateResturantDto, email: string){
    try {
      const restaurant = await this.restaurantsRepo.findOne({where:{id:restaurantId}});
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const user = await this.userRepo.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the user is the creator of the restaurant or an admin
      if (restaurant.createdBy !== user && user.role!=='admin') {
        throw new UnauthorizedException('You are not authorized to update this restaurant');
      }

      
    const updatedResturant = Object.assign(restaurant, restaurantDto);
      await this.restaurantsRepo.save(updatedResturant);
      return {
        status: 200,
        message: 'restaurant details updated successfully',
        data: updatedResturant,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeRestaurant(id: number) {
    try{
  const restaurant = await this.restaurantsRepo.findOne({where:{id:id}});
  if (!restaurant) {
    throw new NotFoundException('Restaurant not found');
  }

  await this.restaurantsRepo.delete(id);
  return {
    status: 200,
    message: 'restaurant deleted successfully',
  };
} catch (error) {
  throw new InternalServerErrorException(error.message);
}
}
  
}
