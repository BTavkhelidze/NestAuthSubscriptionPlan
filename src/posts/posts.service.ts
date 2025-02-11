import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
    role: string,
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

    return post;
  }

  findOne(id) {
    const post = this.postModel.findById(id);
    if (!post) throw new BadRequestException("post not found");

    return post;
  }

  async update(role, userId, id, updatePostDto: UpdatePostDto) {
    const user = await this.userModel.findById(userId);
    if (user?._id.toString() !== userId && role !== "admin") {
      throw new UnauthorizedException("unauthorized");
    }
    if (!user) throw new BadRequestException("user not found");

    await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
    return `This action updates a #${id} post`;
  }

  async remove(role, userId, id) {
    const user = await this.userModel.findById(userId);
    if (user?._id.toString() !== userId && role !== "admin") {
      throw new UnauthorizedException("unauthorized");
    }
    await this.userModel.findByIdAndDelete(user);
    return `This action removes a #${id} post`;
  }
}
