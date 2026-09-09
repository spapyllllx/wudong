package com.wudong.shi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.shi.model.ShiRestaurant;
import com.wudong.shi.service.ShiRestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 餐饮餐厅控制器（模块二）
 */
@RestController
@RequestMapping("/api/shi/restaurants")
public class ShiRestaurantController {

    @Autowired
    private ShiRestaurantService restaurantService;

    /**
     * 餐厅列表（分页）
     */
    @GetMapping
    public Result<?> listRestaurants(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String keyword) {

        LambdaQueryWrapper<ShiRestaurant> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiRestaurant::getStatus, 1);
        if (merchantId != null) {
            wrapper.eq(ShiRestaurant::getMerchantId, merchantId);
        }
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(ShiRestaurant::getName, keyword);
        }
        wrapper.orderByDesc(ShiRestaurant::getRating);
        wrapper.orderByDesc(ShiRestaurant::getCreateTime);

        Page<ShiRestaurant> pageResult = restaurantService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 餐厅详情
     */
    @GetMapping("/{id}")
    public Result<?> getRestaurant(@PathVariable Long id) {
        ShiRestaurant restaurant = restaurantService.getById(id);
        if (restaurant == null || restaurant.getStatus() != 1) {
            return Result.error(404, "餐厅不存在");
        }
        return Result.success(restaurant);
    }

    /**
     * 新增餐厅（商家）
     */
    @PostMapping
    public Result<?> addRestaurant(@RequestBody ShiRestaurant restaurant) {
        restaurant.setStatus(0); // 待审核
        restaurantService.save(restaurant);
        return Result.success("提交成功，等待审核", restaurant.getId());
    }

    /**
     * 更新餐厅（商家）
     */
    @PutMapping("/{id}")
    public Result<?> updateRestaurant(@PathVariable Long id, @RequestBody ShiRestaurant restaurant) {
        ShiRestaurant existing = restaurantService.getById(id);
        if (existing == null) {
            return Result.error(404, "餐厅不存在");
        }
        // 只能修改自己的餐厅
        if (!existing.getMerchantId().equals(restaurant.getMerchantId())) {
            return Result.error(403, "无权操作");
        }
        restaurant.setId(id);
        restaurantService.updateById(restaurant);
        return Result.success("更新成功");
    }

    /**
     * 删除餐厅（商家）
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteRestaurant(@PathVariable Long id) {
        ShiRestaurant existing = restaurantService.getById(id);
        if (existing == null) {
            return Result.error(404, "餐厅不存在");
        }
        // 软删除：将状态设为0
        existing.setStatus(0);
        restaurantService.updateById(existing);
        return Result.success("删除成功");
    }
}
