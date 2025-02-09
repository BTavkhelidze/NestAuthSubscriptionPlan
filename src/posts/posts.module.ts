import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./schema/post.schema";
import { userSchema } from "src/users/schema/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "post", schema: PostSchema }]),
    MongooseModule.forFeature([{ name: "user", schema: userSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
