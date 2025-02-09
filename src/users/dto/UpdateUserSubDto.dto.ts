import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserSubDto {
  @IsNotEmpty()
  @IsString()
  subscriptionPlan: string;
}
