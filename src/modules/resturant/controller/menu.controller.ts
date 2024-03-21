// menu-item.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, SetMetadata, Req, ParseIntPipe } from '@nestjs/common';
import { MenuItemService } from '../service/menu.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { CreateMenuItemDto } from '../dto/menu.dto';
import { Role } from 'src/enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.BusinessOwner)
  create(@Body() createMenuItemDto: CreateMenuItemDto,  @Req() req) {
    return this.menuItemService.create(createMenuItemDto, req.user);
  }

  @Get(':restaurantId')
  async findAll( @Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.menuItemService.findAll(restaurantId);
  }

  @Get(':restaurantId/:id')
  async findOne(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.menuItemService.findOne(restaurantId, id);
  }
}
