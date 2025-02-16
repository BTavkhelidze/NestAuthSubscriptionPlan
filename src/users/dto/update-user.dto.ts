import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    example: "Jhon lennon",
  })
  fullName: string;
}
