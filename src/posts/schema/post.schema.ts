import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Post {
  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "user" })
  user: mongoose.Schema.Types.ObjectId;

  @Prop()
  description: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
