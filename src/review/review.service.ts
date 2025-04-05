import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) {}

    async findAll(): Promise<Review[]> {
        return this.reviewRepository.find({
            relations: ['user', 'product'],
        });
    }

    async findOne(id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['user', 'product'],
        });

        if (!review) {
            throw new NotFoundException(`Отзыв с ID ${id} не найден`);
        }

        return review;
    }

    async create(createReviewDto: Partial<Review>): Promise<Review> {
        const review = this.reviewRepository.create(createReviewDto);
        return this.reviewRepository.save(review);
    }

    async update(id: number, updateReviewDto: Partial<Review>): Promise<Review> {
        const review = await this.findOne(id);
        Object.assign(review, updateReviewDto);
        return this.reviewRepository.save(review);
    }

    async remove(id: number): Promise<void> {
        const review = await this.findOne(id);
        await this.reviewRepository.remove(review);
    }
}