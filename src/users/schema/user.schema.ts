import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Role } from "src/enums/role.enum";
import { Subscription } from "src/enums/subscription.enum";

@Schema()
export class User {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop({ type: String, enum: Subscription, default: Subscription.FREE })
  subscriptionPlan: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "posts" })
  posts: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: string;

  @Prop()
  password: string;

  @Prop()
  imageUrl: string;
}

export const userSchema = SchemaFactory.createForClass(User);
