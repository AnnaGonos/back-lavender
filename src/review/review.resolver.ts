import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review], { name: 'reviews' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<Review[]> {
    return this.reviewService.findAll(page, limit);
  }

  @Query(() => Review, { name: 'review', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Review> {
    return this.reviewService.findOne(id);
  }

  @Mutation(() => Review)
  async createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    const userId = 1;
    return this.reviewService.create(createReviewInput, userId);
  }

  @Mutation(() => Review)
  async updateReview(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewService.update(id, updateReviewInput);
  }

  @Mutation(() => Review)
  async removeReview(@Args('id', { type: () => Int }) id: number) {
    return await this.reviewService.remove(id);
  }
}
