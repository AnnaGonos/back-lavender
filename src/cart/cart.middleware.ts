import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';

@Injectable()
export class CartMiddleware implements NestMiddleware {
    constructor(private readonly cartService: CartService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const userId = 1;
        const cartCount = await this.cartService.getCartItemCount(userId);
        res.locals.cartCount = cartCount;
        next();
    }
}