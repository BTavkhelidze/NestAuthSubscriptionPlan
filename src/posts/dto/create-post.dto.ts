import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    description: "Post title",
    example: "sport",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Post description",
    example: "barcelona won the tournament",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
