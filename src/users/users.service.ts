import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { User } from "./schema/user.schema";
import { Subscription } from "src/enums/subscription.enum";
import { AwsS3Service } from "@/aws-s3/aws-s3.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel("user") private userModel: Model<User>,
    private awsS3Service: AwsS3Service,
  ) {}

  findAll() {
    return this.userModel.find();
  }

  async findOne(id) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const imageUrl = user?.imageUrl;

    console.log(user, "user");
    const imageBuffer = await this.awsS3Service.getImageByFileId(imageUrl);
    console.log(imageBuffer, "image'");
    user.imageUrl = imageBuffer || `images/blank-profile-picture.webp`;

    console.log(user.imageUrl, "new");
    return user;
  }

  getImage(fileId: string) {
    return this.awsS3Service.getImageByFileId(fileId);
  }

  uploadImage(filePath, file) {
    return this.awsS3Service.uploadImage(filePath, file);
  }

  async update(file, role, req, id, updateUserDto: UpdateUserDto) {
    if (req.userId !== id && role !== "admin")
      throw new UnauthorizedException();
    if (!isValidObjectId(id))
      throw new BadRequestException("invalid object Id");

    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException("user not found");
    const userImageUrl = user.imageUrl;

    if (file && !userImageUrl.startsWith("images/blank-profile-picture.webp")) {
      await this.awsS3Service.deleteImageByFileId(userImageUrl);
      console.log("delete");
    }

    const filePath = `images/${uuidv4()}`;

    await this.awsS3Service.uploadImage(filePath, file);

    const newUser: {
      imageUrl?: string;
      fullName?: string;
    } = {};
    if (file) newUser.imageUrl = filePath.toString();
    if (updateUserDto.fullName) newUser.fullName = updateUserDto.fullName;

    await this.userModel.findByIdAndUpdate(
      id,
      newUser,

      {
        new: true,
      },
    );

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

  async deleteImage(id, fileId) {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException("user not found");
    console.log(fileId, "id");

    if (fileId && !fileId.startsWith("images/blank-profile-picture.webp")) {
      await this.awsS3Service.deleteImageByFileId(fileId);
      console.log("delete");
    }

    const newUser: {
      imageUrl?: string;
    } = {};
    if (fileId) newUser.imageUrl = "images/blank-profile-picture.webp";

    const res = await this.userModel.findByIdAndUpdate(id, newUser, {
      new: true,
    });
    return res;
  }
}
