import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { userSchema } from "./schema/user.schema";

import { AwsS3Module } from "@/aws-s3/aws-s3.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "user", schema: userSchema }]),
    AwsS3Module,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
