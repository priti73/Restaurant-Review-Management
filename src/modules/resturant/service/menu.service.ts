// menu-item.service.ts
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entity/menu.entity';
import { CreateMenuItemDto } from '../dto/menu.dto';
import { Resturant } from '../entity/resturant.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    
    @InjectRepository(Resturant)
    private readonly restaurantsRepo: Repository<Resturant>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto, user: any) {
    try {
      const { name, category, price, restaurantId } = createMenuItemDto;
      const restaurant = await this.restaurantsRepo.findOne({ where: { id: restaurantId } });
      
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }
  
      if (user.role !== 'admin' && restaurant.createdBy !== user.id) {
        throw new UnauthorizedException('You are not authorized to create a menu item for this restaurant');
      }
  
      const menuItem = this.menuItemRepository.create({
        name,
        category,
        price,
        restaurant: [restaurant]
      })
      await this.menuItemRepository.save(menuItem);
  
  
      return {
        status: 201,
        message: 'Menu created successfully',
        data: menuItem,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  

  async findAll(restaurantId: number) {
    try {
      const menuListWithAvgRating = await this.menuItemRepository
        .createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.restaurant', 'restaurant')
        .leftJoinAndSelect('menuItem.reviews', 'review')
        .andWhere('restaurant.id = :restaurantId', { restaurantId })
        .select([
          'menuItem',
          'AVG(review.rating) AS avgRating'
        ])
        .groupBy('menuItem.id') 
        .getRawMany();

      return {
        status: 200,
        message: 'Menu list fetched successfully',
        data: menuListWithAvgRating,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  

  async findOne(restaurantId: number, menuItemId: number) {
    try {
      const menuItemWithAvgRating = await this.menuItemRepository
        .createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.restaurant', 'restaurant')
        .leftJoinAndSelect('menuItem.reviews', 'review')
        .andWhere('restaurant.id = :restaurantId', { restaurantId })
        .andWhere('menuItem.id = :menuItemId', { menuItemId })
        .select([
          'menuItem',
          'AVG(review.rating) AS avgRating' 
        ])
        .groupBy('menuItem.id') 
        .getRawOne();

      if (!menuItemWithAvgRating) {
        throw new NotFoundException('Menu item not found');
      }

      return {
        status: 200,
        message: 'Menu fetched successfully',
        data: menuItemWithAvgRating,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

