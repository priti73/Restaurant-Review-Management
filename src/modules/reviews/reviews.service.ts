// review.service.ts
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';
import { User } from '../user/user.entity';
import { Resturant } from '../resturant/entity/resturant.entity';
import { MenuItem } from '../resturant/entity/menu.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Resturant)
    private readonly restaurantsService: Repository<Resturant>,
    
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  async create(reviewData: CreateReviewDto, user: any) {
    try{
    const menu= await this.menuItemRepository.findOne({where:{id:reviewData.menuItemId}})
    const reviwer=await this.userRepo.findOne({where:{email:user.email}})
    const review = this.reviewRepository.create();
    review.rating=reviewData.rating;
    review.comment=reviewData.comment;
    review.user=reviwer;
    review.menuItem=menu
     
    await this.reviewRepository.save(review);
    return {
      status: 201,
      message: 'review created successfully',
      data: review,
    };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
  }

  async getAll() {
    try {
      const reviews = await this.reviewRepository.find();
      return {
        status: 200,
        message: 'Reviews fetched successfully',
        data: reviews,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getById(id: number) {
    try {
      const review = await this.reviewRepository.findOne({ where: { id } });
      if (!review) {
        throw new NotFoundException('Review not found');
      }
      return {
        status: 200,
        message: 'Review fetched successfully',
        data: review,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async update(id: number, reviewData: UpdateReviewDto , user: any) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the user is the owner of the review or an admin
    if (user.role !== 'admin' && review.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized to update this review');
    }

    review.rating = reviewData.rating;
    review.comment = reviewData.comment;

    try {
      const updatedReview = await this.reviewRepository.save(review);
      return {
        status: 200,
        message: 'Review updated successfully',
        data: updatedReview,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number,user:any) {
    const review = await this.reviewRepository.findOne({where:{id:id}});
    if (!review) {
      throw new NotFoundException('Review not found');
    }

     if (review.user!== user && user.role!=='admin') {
      throw new UnauthorizedException('You are not authorized to delete this reviwe');
    }

    await this.reviewRepository.delete(id);
    return "reviwe deleted";
  }
}
