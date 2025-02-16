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
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "./role.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Subscription } from "./subscription.decorator";
import { UpdateUserSubDto } from "./dto/UpdateUserSubDto.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller("users")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    example: {
      _id: "67a9111be441c53bdbf92cca",
      fullName: "Jhon recipient",
      email: "Jhonrecipient@gmail.com",
      subscriptionPlan: "free",
      posts: [],
      role: "user",
      password: "$2b$10$WaE8M1GoCvwCjzgt6Tici.tvQOljTFcrdziF0TWGnePKJOHYi0Nee",
      __v: 0,
    },
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Post("uploadImage")
  // @UseInterceptors(FilesInterceptor("file"))
  // uploadImage(@UploadedFiles() file: Express.Multer.File) {
  //   const filePath = `images/${uuidv4()}`;

  //   return this.usersService.uploadImage(filePath, file[0].buffer);
  // }

  @Post("/getImage")
  getImage(@Body("fileId") fileId: string) {
    return this.usersService.getImage(fileId);
  }

  @Put(":id/deleteImg")
  deleteImage(@Param("id") id, @Body("fileId") fileId: string) {
    return this.usersService.deleteImage(id, fileId);
  }
  @ApiOkResponse({
    example: {
      _id: "67a9111be441c53bdbf92cca",
      fullName: "Jhon recipient",
      email: "Jhonrecipient@gmail.com",
      subscriptionPlan: "free",
      posts: [],
      role: "user",
      password: "$2b$10$WaE8M1GoCvwCjzgt6Tici.tvQOljTFcrdziF0TWGnePKJOHYi0Nee",
      __v: 0,
    },
  })
  @ApiParam({
    name: "id",
    required: true,
    example: "67a9111be441c53bdbf92cca",
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiOkResponse({
    example: `This action updates a #67a9111be441c53bdbf92cca user`,
  })
  @ApiBadRequestResponse({
    example: "invalid object Id",
  })
  @ApiParam({
    name: "id",
    required: true,
    example: "67a9111be441c53bdbf92cca",
  })
  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  update(
    @UploadedFile("file") file: Express.Multer.File,

    @Role() role,
    @Req() req,
    @Param("id") id: string,

    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto.fullName);
    return this.usersService.update(file.buffer, role, req, id, updateUserDto);
  }

  @ApiBadRequestResponse({
    example: "invalid object Id",
  })
  @ApiOkResponse({
    example: {
      _id: "67a9111be441c53bdbf92cca",
      fullName: "Jhon recipient",
      email: "Jhonrecipient@gmail.com",
      subscriptionPlan: "free",
      posts: [],
      role: "user",
      password: "$2b$10$WaE8M1GoCvwCjzgt6Tici.tvQOljTFcrdziF0TWGnePKJOHYi0Nee",
      __v: 0,
    },
  })
  @ApiParam({
    name: "id",
    required: true,
    example: "67a9111be441c53bdbf92cca",
  })
  @Delete(":id")
  remove(@Role() role, @Req() req, @Param("id") id: string) {
    return this.usersService.remove(role, req, id);
  }

  @ApiBadRequestResponse({
    example: "Invalid subscription plan",
  })
  @ApiOkResponse({
    example: `This action updates user subscription to {
      _id: "67a9111be441c53bdbf92cca",
      fullName: "Jhon recipient",
      email: "Jhonrecipient@gmail.com",
      subscriptionPlan: "basic",
      posts: [],
      role: "user",
      password: "$2b$10$WaE8M1GoCvwCjzgt6Tici.tvQOljTFcrdziF0TWGnePKJOHYi0Nee",
      __v: 0,
    },`,
  })
  @ApiParam({
    name: "id",
    required: true,
    example: "67a9111be441c53bdbf92cca",
  })
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
