import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FavoriteService } from './favorite.service';

@Injectable()
export class FavoritesMiddleware implements NestMiddleware {
  constructor(private readonly favoriteService: FavoriteService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id ?? 0;

    try {
      const favoritesCount = await this.favoriteService.countFavorites(userId);
      res.locals.favoritesCount = favoritesCount || 0;
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      res.locals.favoritesCount = 0;
    }

    next();
  }
}
