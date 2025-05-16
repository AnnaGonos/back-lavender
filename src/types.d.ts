import { User } from '../user/entities/user.entity';
import 'express-session';

declare module 'express' {
  interface Request {
    session: import('express-session').Session & {
      user?: User;
    };
    user?: User;
  }
}