import { BadRequestException, Injectable } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/schema/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("user") private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  //    async signIn(username: string, password: string){}

  async signUp({ email, password, fullName }: SignUpDto) {
    const existuser = await this.userModel.findOne({ email });

    if (existuser) throw new BadRequestException("user already exists");
    const hashedPasword = await bcrypt.hash(password, 10);

    await this.userModel.create({
      email,
      fullName,
      password: hashedPasword,
      imageUrl: `images/blank-profile-picture.webp`,
    });
    return "user registration successful";
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException("email or password is Invalid");
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new BadRequestException("email or password is Invalid");
    const payload = {
      userId: user._id,
      subscriptionPlan: user.subscriptionPlan,
      role: user.role,
    };
    const token = await this.jwtService.sign(payload);
    return { token };
  }

  async getProfile(userId) {
    const user = await this.userModel.findById(userId);

    return user;
  }
}
