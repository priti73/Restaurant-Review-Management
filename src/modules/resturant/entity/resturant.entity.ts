

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { MenuItem } from './menu.entity';
import { User } from 'src/modules/user/user.entity';


@Entity()
export class Resturant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];
  
  @ManyToMany(() => MenuItem, menuItem => menuItem.restaurant)
  @JoinTable()
  menuItems: MenuItem[];

  @ManyToOne(() => User, user => user.restaurants)
  createdBy: User;

}
