import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extracTokenFromHeader(request);

    if (!token) throw new BadRequestException("token is required");
    try {
      const payload = await this.jwtService.verify(token);

      request["userId"] = payload.userId;
      request.subscriptionPlan = payload.subscriptionPlan;
      request.role = payload.role;
      return true;
    } catch {
      throw new BadRequestException("permission denied");
    }
  }

  private extracTokenFromHeader(request: Request) {
    const authorization = request.headers["authorization"];

    if (!authorization) return null;
    const [type, token] = authorization.split(" ");

    return type === "Bearer" ? token : undefined;
  }
}
