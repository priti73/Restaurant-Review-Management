// review.controller.ts
import { Controller, Post, UseGuards, Body, Req, Get, Param, Patch, Delete } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';
import { Role } from 'src/enum/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User,Role.Admin)
  async create(@Body() reviewData: CreateReviewDto, @Req() req) {
    const user = req.user; 
    return this.reviewService.create(reviewData, user);
  }

  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.reviewService.getById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User, Role.Admin,Role.BusinessOwner)
  async update(@Param('id') id: number, @Body() reviewData: UpdateReviewDto ,@Req() req) {
    return this.reviewService.update(id, reviewData,req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User, Role.Admin)
  async delete(@Param('id') id: number,@Req() req) {
    return this.reviewService.delete(id,req.user);
  }
}
