import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from "./schema/post.schema";
import { User } from "src/users/schema/user.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel("post") private postModel: Model<Post>,
    @InjectModel("user") private userModel: Model<User>,
  ) {}

  async create(
    supscription: string,
    userId: string,
    createPostDto: CreatePostDto,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new BadRequestException("user not found");
    const postsLength = Object.values(user.posts).length;

    if (supscription === "free" && postsLength >= 3)
      throw new BadRequestException("upgrade subscription plan");
    if (supscription === "basic" && postsLength >= 100)
      throw new BadRequestException("upgrade subscription plan");
    if (supscription === "premium" && postsLength >= 300)
      throw new BadRequestException("upgrade subscription plan");

    const post = await this.postModel.create({
      ...createPostDto,
      user: userId,
    });

    await this.userModel.findByIdAndUpdate(userId, {
      $push: { posts: post._id },
    });

    return post;
  }

  async findAll() {
    const post = await this.postModel.find();
    console.log(post);
    return this.postModel.find();
  }

  findOne(id: number) {
    const post = this.postModel.findById(id);
    if (!post) throw new BadRequestException("post not found");

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
