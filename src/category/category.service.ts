import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {Category} from "./entities/category.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find();
            return categories || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const newCategory = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(newCategory);
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<void> {
        const category = await this.findOne(id);
        Object.assign(category, updateCategoryDto);
        await this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
}