import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { User } from "src/users/users.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Subscription } from "src/users/subscription.decorator";
import { Role } from "src/users/role.decorator";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("posts")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiCreatedResponse({
    schema: {
      example: {
        _id: "67a7d7dd2d50d2b6c78251f7",
        title: "sport",
        user: "67a7aa13fba76e0d728a1d44",
        description: "football game",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: "post not found",
      error: "Not Found",
      statusCode: 404,
    },
  })
  create(
    @Role() role,
    @Subscription() supscription,
    @User() userId,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(role, supscription, userId, createPostDto);
  }

  @ApiOkResponse({
    schema: {
      example: {
        _id: "67a7d7dd2d50d2b6c78251f7",
        title: "sport",
        user: "67a7aa13fba76e0d728a1d44",
        description: "football game",
        __v: 0,
      },
    },
  })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiOkResponse({
    schema: {
      example: {
        _id: "67a7d7dd2d50d2b6c78251f7",
        title: "sport",
        user: "67a7aa13fba76e0d728a1d44",
        description: "football game",
        __v: 0,
      },
    },
  })
  @ApiNotFoundResponse({
    example: "post not found",
  })
  @Get(":id")
  @ApiParam({
    name: "id",
    required: true,
    example: "67a7d7dd2d50d2b6c78251f7",
  })
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @ApiUnauthorizedResponse({
    example: "unauthorized",
  })
  @ApiOkResponse({
    example: "This action updates a #67a7d7dd2d50d2b6c78251f7 post",
  })
  @ApiNotFoundResponse({
    example: "user not found",
  })
  @Patch(":id")
  @ApiParam({
    name: "id",
    required: true,
    example: "67a7d7dd2d50d2b6c78251f7",
  })
  update(
    @Role() role,
    @User() userId: string,
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(role, userId, id, updatePostDto);
  }

  @ApiUnauthorizedResponse({
    example: "unauthorized",
  })
  @ApiOkResponse({
    example: "This action deletes a #67a7d7dd2d50d2b6c78251f7",
  })
  @ApiNotFoundResponse({
    example: "post not found",
  })
  @Delete(":id")
  @ApiParam({
    name: "id",
    required: true,
    example: "67a7d7dd2d50d2b6c78251f7",
  })
  remove(@Role() role, @User() userId, @Param("id") id: string) {
    return this.postsService.remove(role, userId, id);
  }
}
