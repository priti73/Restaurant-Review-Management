import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./user.dto";
import { UsersService } from "./user.service";
import { LoginDto } from "src/modules/user/login.dto";
import { AuthService } from "src/auth/jwt.service";


@Controller()
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
  
      private readonly authService: AuthService,
    ) {}
  
    @Post('/signup/user')
    async createUser(@Body() userDto: CreateUserDto) {
      return this.usersService.createUser({
     ...userDto,
      });
    }

    @Post('/signup/BusinessOwner')
    async createBusinessOwner(@Body() userDto: CreateUserDto) {
      return this.usersService.createBusinessOwner({
     ...userDto,
      });
    }

    @Post('/signup/Admin')
    async createAdmin(@Body() userDto: CreateUserDto) {
      return this.usersService. createAdmin({
     ...userDto,
      });
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
      const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        return { message: 'Invalid credentials' };
      }
      
     const token = this.usersService.generateToken(user);
      
     return { token };
    }
}