import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
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

  @Prop()
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
