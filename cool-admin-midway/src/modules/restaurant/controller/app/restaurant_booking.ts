import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { RestaurantBookingService } from '../../service/restaurant_booking';

/**
 * 餐厅预订（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/restaurant/booking')
export class AppRestaurantBookingController extends BaseController {
  @Inject()
  restaurantBookingService: RestaurantBookingService;

  @Inject()
  ctx;

  /**
   * 创建预订
   */
  @Post('/create', { summary: '创建预订' })
  async createBooking(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const booking = await this.restaurantBookingService.createBooking(userId, data);
    return this.ok(booking);
  }

  /**
   * 预订列表
   */
  @Post('/list', { summary: '预订列表' })
  async bookingList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body('status') status?: number
  ) {
    const userId = this.ctx.user?.id || 1;
    const result = await this.restaurantBookingService.getBookingList(userId, page, size, status);
    return this.ok(result);
  }

  /**
   * 预订详情
   */
  @Post('/detail', { summary: '预订详情' })
  async bookingDetail(@Body('bookingNo') bookingNo: string) {
    const userId = this.ctx.user?.id || 1;
    const booking = await this.restaurantBookingService.getBookingDetail(bookingNo, userId);
    return this.ok(booking);
  }

  /**
   * 取消预订
   */
  @Post('/cancel', { summary: '取消预订' })
  async cancelBooking(
    @Body('bookingNo') bookingNo: string,
    @Body('reason') reason: string = '不想预订了'
  ) {
    const userId = this.ctx.user?.id || 1;
    await this.restaurantBookingService.cancelBooking(bookingNo, userId, reason);
    return this.ok();
  }
}
