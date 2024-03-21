// src/reviews/review.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { MenuItem } from '../resturant/entity/menu.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => MenuItem, menuItem => menuItem.reviews)
  menuItem: MenuItem;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

}
