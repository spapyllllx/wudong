import { YiProductCategoryEntity } from '../modules/yi/entity/category';
import { YiProductEntity } from '../modules/yi/entity/product';
import { YiProductSkuEntity } from '../modules/yi/entity/sku';
import { YiProductImageEntity } from '../modules/yi/entity/image';
import { YiProductFavoriteEntity } from '../modules/yi/entity/favourite';
import { YiProductReviewEntity } from '../modules/yi/entity/review';
import { ShiRestaurantEntity } from '../modules/shi/entity/restaurant';
import { ShiRestaurantDishEntity } from '../modules/shi/entity/dish';
import { ShiRestaurantTimeslotEntity } from '../modules/shi/entity/timeslot';
import { ShiRestaurantBookingEntity } from '../modules/shi/entity/booking';
import { ShiAgriCategoryEntity } from '../modules/shi/entity/agriCategory';
import { ShiAgriProductEntity } from '../modules/shi/entity/agriProduct';
import { ZhuHomestayEntity } from '../modules/zhu/entity/homestay';
import { ZhuHomestayRoomTypeEntity } from '../modules/zhu/entity/roomType';
import { ZhuHomestayRoomCalendarEntity } from '../modules/zhu/entity/roomCalendar';
import { ZhuHomestayBookingEntity } from '../modules/zhu/entity/booking';
import { XingScenicSpotEntity } from '../modules/xing/entity/scenicSpot';
import { XingTicketTypeEntity } from '../modules/xing/entity/ticketType';
import { XingRoutePackageEntity } from '../modules/xing/entity/routePackage';
import { XingRouteItineraryEntity } from '../modules/xing/entity/routeItinerary';
import { XingETicketEntity } from '../modules/xing/entity/eTicket';
import { XingTrafficGuideEntity } from '../modules/xing/entity/trafficGuide';
import { ShequTopicEntity } from '../modules/shequ/entity/topic';
import { ShequPostEntity } from '../modules/shequ/entity/post';
import { ShequPostImageEntity } from '../modules/shequ/entity/postImage';
import { ShequPostCommentEntity } from '../modules/shequ/entity/postComment';
import { ShequLikeEntity } from '../modules/shequ/entity/like';
import { ShequPostFavoriteEntity } from '../modules/shequ/entity/postFavorite';
import { ShequTopicFollowEntity } from '../modules/shequ/entity/topicFollow';
import { ShequUserFollowEntity } from '../modules/shequ/entity/userFollow';
import { ShequReportEntity } from '../modules/shequ/entity/report';
import { OrderMainEntity } from '../modules/order/entity/mainOrder';
import { OrderProductItemEntity } from '../modules/order/entity/productItem';
import { OrderProductLogisticsEntity } from '../modules/order/entity/logistics';
import { OrderRefundEntity } from '../modules/order/entity/refund';
import { CartItemEntity } from '../modules/cart/entity/item';
import { SysBannerEntity } from '../modules/system/entity/banner';
import { SysAnnouncementEntity } from '../modules/system/entity/announcement';
import { SysSensitiveWordEntity } from '../modules/system/entity/sensitiveWord';
import { SysSystemMessageEntity } from '../modules/system/entity/systemMessage';
import { MerchantApplicationEntity } from '../modules/system/entity/merchantApplication';
import { AppUserEntity } from '../modules/system/entity/appUser';

export const entities = [
  YiProductCategoryEntity, YiProductEntity, YiProductSkuEntity, YiProductImageEntity, YiProductFavoriteEntity, YiProductReviewEntity,
  ShiRestaurantEntity, ShiRestaurantDishEntity, ShiRestaurantTimeslotEntity, ShiRestaurantBookingEntity, ShiAgriCategoryEntity, ShiAgriProductEntity,
  ZhuHomestayEntity, ZhuHomestayRoomTypeEntity, ZhuHomestayRoomCalendarEntity, ZhuHomestayBookingEntity,
  XingScenicSpotEntity, XingTicketTypeEntity, XingRoutePackageEntity, XingRouteItineraryEntity, XingETicketEntity, XingTrafficGuideEntity,
  ShequTopicEntity, ShequPostEntity, ShequPostImageEntity, ShequPostCommentEntity, ShequLikeEntity, ShequPostFavoriteEntity, ShequTopicFollowEntity, ShequUserFollowEntity, ShequReportEntity,
  OrderMainEntity, OrderProductItemEntity, OrderProductLogisticsEntity, OrderRefundEntity,
  CartItemEntity,
  SysBannerEntity, SysAnnouncementEntity, SysSensitiveWordEntity, SysSystemMessageEntity, MerchantApplicationEntity, AppUserEntity,
];