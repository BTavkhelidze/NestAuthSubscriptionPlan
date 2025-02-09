import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "./role.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Subscription } from "./subscription.decorator";
import { UpdateUserSubDto } from "./dto/UpdateUserSubDto.dto";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Role() role,
    @Req() req,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(role, req, id, updateUserDto);
  }

  @Delete(":id")
  remove(@Role() role, @Req() req, @Param("id") id: string) {
    return this.usersService.remove(role, req, id);
  }
  @Put(":id/update-subscription")
  updateSubscription(
    @Subscription() subscription,
    @Req() req,
    @Param("id") id,
    @Body() UpdateUserSubDto: UpdateUserSubDto,
  ) {
    return this.usersService.updateSubscription(
      subscription,
      req,
      id,
      UpdateUserSubDto,
    );
  }
}
