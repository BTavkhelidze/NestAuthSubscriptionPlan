import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { User } from "./schema/user.schema";
import { Subscription } from "src/enums/subscription.enum";

@Injectable()
export class UsersService {
  constructor(@InjectModel("user") private userModel: Model<User>) {}

  findAll() {
    return this.userModel.find();
  }

  async findOne(id) {
    return await this.userModel.findById(id);
  }

  async update(role, req, id, updateUserDto: UpdateUserDto) {
    if (req.userId !== id && role !== "admin")
      throw new UnauthorizedException();
    if (!isValidObjectId(id)) throw new BadRequestException("invalid object");
    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    if (!updateUser) throw new NotFoundException("user not found");
    return `This action updates a #${id} user`;
  }

  async remove(role, req, id) {
    if (req.userId !== id && role !== "admin")
      throw new UnauthorizedException();
    if (!isValidObjectId(id)) throw new BadRequestException("invalid object");
    return await this.userModel.findByIdAndDelete(id);
  }

  async updateSubscription(subscription, req, id, updateUserSubDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException("User not found");

    if (
      !Object.values(Subscription).includes(updateUserSubDto.subscriptionPlan)
    ) {
      throw new BadRequestException("Invalid subscription plan");
    }

    if (subscription === updateUserSubDto.subscriptionPlan) {
      throw new BadRequestException("Subscription already exists");
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { subscriptionPlan: updateUserSubDto.subscriptionPlan },
      { new: true },
    );

    return `This action updates user subscription to ${updatedUser}`;
  }
}
