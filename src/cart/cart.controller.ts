import {
    Controller,
    Get,
    Post,
    Body,
    Render,
    Session,
    Req,
    HttpException,
    HttpStatus,
    Param,
    Delete
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import {Cart} from "./entities/сart.entity";
import {UserService} from "../user/user.service";
import {Order} from "../order/entities/order.entity";
import {DeliveryType} from "../order/entities/delivery-type.enum";
import {OrderService} from "../order/order.service";

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly userService: UserService,
    ) {}

    @Get('')
    @Render('cart')
    async getCartPage(@Session() session: Record<string, any>) {
        const userId = 1;
        const cartItems = await this.cartService.getCartItems(userId);

        if (!cartItems || cartItems.length === 0) {
            return { pageTitle: 'Корзина', cartItems: [], originalSum: 0, discountAmount: 0, user: null,};
        }

        const user = await this.userService.findOne(userId);
        const originalSum = this.cartService.calculateOriginalSum(cartItems);
        const discountAmount = this.cartService.calculateDiscountAmount(cartItems);

        return {
            pageTitle: 'Корзина',
            cartItems,
            originalSum,
            discountAmount,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        };
    }

    @Post(':productId/add')
    async addItemToCart(@Param('productId') productId: string): Promise<{ added: boolean }> {
        const userId = 1;
        await this.cartService.addItemToCart(userId, parseInt(productId, 10));
        return { added: true };
    }

    @Delete(':productId/remove')
    async removeItemFromCart(@Param('productId') productId: string): Promise<{ removed: boolean }> {
        const userId = 1;
        await this.cartService.removeItemFromCart(userId, parseInt(productId, 10));
        return { removed: true };
    }

    @Post(':productId/increase')
    async increaseQuantity(@Param('productId') productId: string): Promise<{ updated: boolean }> {
        const userId = 1;
        await this.cartService.increaseQuantity(userId, parseInt(productId, 10));
        return { updated: true };
    }

    @Post(':productId/decrease')
    async decreaseQuantity(@Param('productId') productId: string): Promise<{ updated: boolean }> {
        const userId = 1;
        await this.cartService.decreaseQuantity(userId, parseInt(productId, 10));
        return { updated: true };
    }

    @Get('count')
    async getCartCount(): Promise<{ count: number }> {
        const userId = 1;
        const count = await this.cartService.getCartItemCount(userId);
        return { count };
    }

    @Get('items')
    async getCartItems(): Promise<Cart[]> {
        const userId = 1;
        return await this.cartService.getCartItems(userId);
    }

}