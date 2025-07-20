import { JwtPayloadType } from '../auth/types/jwt-payload.type';

declare module 'express' {
  interface Request {
    user?: JwtPayloadType;
  }
}
