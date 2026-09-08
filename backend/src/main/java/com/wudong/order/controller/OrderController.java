package com.wudong.order.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.order.model.Order;
import com.wudong.order.service.OrderService;
import com.wudong.common.util.JwtUtil;
import com.wudong.common.util.RequestContextUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 获取当前用户ID
     */
    private Long getCurrentUserId() {
        Object userId = RequestContextUtil.getRequest().getAttribute("userId");
        return userId != null ? Long.parseLong(userId.toString()) : null;
    }

    /**
     * 我的订单列表
     */
    @GetMapping
    public Result<?> listOrders(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer orderType,
            @RequestParam(required = false) Integer status) {
        
        Long userId = getCurrentUserId();
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        if (orderType != null) {
            wrapper.eq(Order::getOrderType, orderType);
        }
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreateTime);

        Page<Order> orderPage = orderService.page(new Page<>(page, size), wrapper);
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", orderPage.getRecords());
        result.put("total", orderPage.getTotal());
        result.put("page", page);
        result.put("size", size);
        
        return Result.success(result);
    }

    /**
     * 订单详情
     */
    @GetMapping("/{id}")
    public Result<?> getOrder(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Order order = orderService.getOne(
            new LambdaQueryWrapper<Order>()
                .eq(Order::getId, id)
                .eq(Order::getUserId, userId)
        );
        
        if (order == null) {
            return Result.error(404, "订单不存在");
        }
        return Result.success(order);
    }
}
