
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { Review } from '../reviews/reviews.entity';
import { Resturant } from '../resturant/entity/resturant.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email:string;

  @Column()
  role: string; 


  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Resturant, restaurant => restaurant.createdBy)
  restaurants:Resturant[];
}
