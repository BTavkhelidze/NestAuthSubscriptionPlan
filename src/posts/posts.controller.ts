import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { User } from "src/users/users.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Subscription } from "src/users/subscription.decorator";
import { Role } from "src/users/role.decorator";

@Controller("posts")
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Role() role,
    @Subscription() supscription,
    @User() userId,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(role, supscription, userId, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Role() role,
    @User() userId,
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(role, userId, id, updatePostDto);
  }

  @Delete(":id")
  remove(@Role() role, @User() userId, @Param("id") id: string) {
    return this.postsService.remove(role, userId, id);
  }
}
