import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Render,
  UseInterceptors,
  UploadedFile,
  Patch, ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadConfig } from './file-upload.config';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {UserService} from "../user/user.service";
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('reviews')
@ApiExcludeController()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService,
              private readonly userService: UserService)
  {}

  @Get()
  @Render('reviews/all')
  async findAll() {
    const userId = 1;
    const user = await this.userService.findOne(userId);
    const reviews = await this.reviewService.findAll();
    return {
      pageTitle: 'Отзывы заказчиков', reviews, user
    };
  }

  @Get('add')
  @Render('reviews/add')
  async getAddReviewPage() {
    return {
      pageTitle: 'Добавить отзыв'
    };
  }

  @Post('/add')
  @UseInterceptors(FileInterceptor('image', fileUploadConfig))
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = 1;
    const imagePath = file ? `/uploads/reviews/${file.filename}` : undefined;

    return this.reviewService.create(createReviewDto, +userId, imagePath);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto) {
    await this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.remove(id);
  }
}
