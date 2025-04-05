import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FavoriteService } from './favorite.service';

@Injectable()
export class FavoritesMiddleware implements NestMiddleware {
    constructor(private readonly favoriteService: FavoriteService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const userId = 1;
        const favoritesCount = await this.favoriteService.countFavorites(userId);
        res.locals.favoritesCount = favoritesCount;
        next();
    }
}