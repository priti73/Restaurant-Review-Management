// menu-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Resturant } from './resturant.entity';
import { Review } from 'src/modules/reviews/reviews.entity';
@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'float' })
  price: number;

  @ManyToMany(() =>  Resturant, restaurant => restaurant.menuItems)
  restaurant: Resturant[];

  @OneToMany(() => Review, review => review.menuItem)
  reviews: Review[];
}

