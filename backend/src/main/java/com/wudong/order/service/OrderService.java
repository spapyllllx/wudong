package com.wudong.order.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wudong.order.mapper.OrderMapper;
import com.wudong.order.model.Order;
import org.springframework.stereotype.Service;

/**
 * 订单服务
 */
@Service
public class OrderService extends ServiceImpl<OrderMapper, Order> {
}
