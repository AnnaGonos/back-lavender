import { forwardRef, Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Review} from "./entities/review.entity";
import {ReviewController} from "./review.controller";
import {ReviewService} from "./review.service";
import {User} from "../user/entities/user.entity";
import { ReviewResolver } from './review.resolver';
import { UserModule } from '../user/user.module';
import { ReviewApiController } from './review.api.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review, User]),
        forwardRef(() => UserModule),
    ],
    controllers: [ReviewController, ReviewApiController],
    providers: [ReviewService, ReviewResolver],
    exports: [ReviewService],
})
export class ReviewModule {}
