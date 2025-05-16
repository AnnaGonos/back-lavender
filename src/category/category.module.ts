import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryApiController } from './category.api.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoryController, CategoryApiController],
    providers: [CategoryService, CategoryResolver],
    exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
