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
  Redirect,
  UseFilters, Patch, Query, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadConfig } from './file-upload.config';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiBadRequestResponse, ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation, ApiParam, ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from '../all.exception.filter';
import { Review } from './entities/review.entity';
import {UserService} from "../user/user.service";

@ApiTags('reviews')
@UseFilters(AllExceptionsFilter)
@Controller('api/reviews')
export class ReviewApiController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews with pagination' })
  @ApiOkResponse({ description: 'Reviews fetched successfully', type: [Review] })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Number of reviews per page',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<any> {
    return this.reviewService.findAll(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiCreatedResponse({ description: 'Review created successfully', type: Review })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Получение отзыва по ID' })
  @ApiOkResponse({ description: 'Отзыв успешно загружен', type: Review })
  @ApiNotFoundResponse({ description: 'Отзыв не найден' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID отзыва', example: '1' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление отзыва' })
  @ApiOkResponse({ description: 'Отзыв успешно обновлен' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Отзыв не найден' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID отзыва', example: '1' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto) {
    await this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление отзыва' })
  @ApiNoContentResponse({ description: 'Отзыв успешно удален',})
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Отзыв не найден' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID отзыва', example: '1' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.remove(id);
  }
}
