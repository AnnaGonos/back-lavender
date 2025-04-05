// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { ProductService } from './product.service';
//
// @Injectable()
// export class ProductsMiddleware implements NestMiddleware {
//     constructor(private readonly productService: ProductService) {}
//
//     async use(req: Request, res: Response, next: NextFunction) {
//         const userId = 1;
//         const products = await this.productService.getProducts(userId);
//         res.locals.products = products;
//         next();
//     }
// }