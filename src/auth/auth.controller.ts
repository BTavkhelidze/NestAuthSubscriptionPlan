import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthGuard } from "./auth.guard";
import { User } from "src/users/users.decorator";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    schema: {
      example: "user registered successfully",
    },
  })
  @ApiBadRequestResponse({
    example: "user already exists",
  })
  @Post("sign-up")
  signUp(@Body() param: SignUpDto) {
    return this.authService.signUp(param);
  }

  @ApiBadRequestResponse({
    schema: {
      example: "email or password is Invalid",
    },
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2E4NzdjYTEwZWEzYjczNzA5OWY2ODYiLCJzdWJzY3JpcHRpb25QbGFuIjoiZnJlZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM5MTAxNTk3LCJleHAiOjE3MzkxMDUxOTd9.ldgC4fggTwrJBkkv0iRfqu429-OoyQvaWYpJL-svXjE",
      },
    },
  })
  @Post("sign-in")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @Get("profile")
  @ApiOkResponse({
    schema: {
      example: {
        _id: "67a9111be441c53bdbf92cca",
        fullName: "Jhon recipient",
        email: "Jhonrecipient@gmail.com",
        subscriptionPlan: "free",
        posts: [],
        role: "user",
        password:
          "$2b$10$WaE8M1GoCvwCjzgt6Tici.tvQOljTFcrdziF0TWGnePKJOHYi0Nee",
        __v: 0,
      },
    },
  })
  @UseGuards(AuthGuard)
  getProfile(@User() userId) {
    return this.authService.getProfile(userId);
  }
}
