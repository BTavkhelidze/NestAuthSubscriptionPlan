import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserSubDto {
  @ApiProperty({
    example: "free | premium | basic",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  subscriptionPlan: string;
}
