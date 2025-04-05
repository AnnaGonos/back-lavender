import {Controller, Get, Post, Patch, Delete, Param, Body, Res, Render} from '@nestjs/common';
import { Response } from 'express';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    @Render('reviews/all-reviews')
    async findAll() {
        const reviews = await this.reviewService.findAll();
        return { pageTitle: 'Все отзывы', reviews };
    }

    @Get(':id')
    @Render('reviews/review-details')
    async findOne(@Param('id') id: string) {
        const review = await this.reviewService.findOne(parseInt(id, 10));
        return { pageTitle: `Отзыв №${review.id}`, review };
    }

    @Post()
    async create(@Body() createReviewDto: Partial<Review>, @Res() res: Response) {
        await this.reviewService.create(createReviewDto);
        return res.redirect('/reviews');
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReviewDto: Partial<Review>, @Res() res: Response) {
        await this.reviewService.update(parseInt(id, 10), updateReviewDto);
        return res.redirect(`/reviews/${id}`);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.reviewService.remove(parseInt(id, 10));
        return res.redirect('/reviews');
    }

    @Get('/add')
    @Render('reviews/add-review')
    addReviewPage() {
        return { pageTitle: 'Добавить отзыв' };
    }

    @Get(':id/edit')
    @Render('reviews/edit-review')
    async editReviewPage(@Param('id') id: string) {
        const review = await this.reviewService.findOne(parseInt(id, 10));
        return { pageTitle: `Изменить отзыв №${review.id}`, review };
    }
}