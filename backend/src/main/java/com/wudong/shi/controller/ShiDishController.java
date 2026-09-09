package com.wudong.shi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.shi.model.ShiDish;
import com.wudong.shi.service.ShiDishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 菜品控制器（模块二）
 */
@RestController
@RequestMapping("/api/shi/dishes")
public class ShiDishController {

    @Autowired
    private ShiDishService dishService;

    /**
     * 菜品列表（按餐厅）
     */
    @GetMapping
    public Result<?> listDishes(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam Long restaurantId,
            @RequestParam(required = false) Integer isSignature) {

        LambdaQueryWrapper<ShiDish> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiDish::getRestaurantId, restaurantId);
        wrapper.eq(ShiDish::getStatus, 1);
        if (isSignature != null) {
            wrapper.eq(ShiDish::getIsSignature, isSignature);
        }
        wrapper.orderByAsc(ShiDish::getIsSignature);
        wrapper.orderByDesc(ShiDish::getCreateTime);

        Page<ShiDish> pageResult = dishService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 菜品详情
     */
    @GetMapping("/{id}")
    public Result<?> getDish(@PathVariable Long id) {
        ShiDish dish = dishService.getById(id);
        if (dish == null || dish.getStatus() != 1) {
            return Result.error(404, "菜品不存在");
        }
        return Result.success(dish);
    }

    /**
     * 新增菜品
     */
    @PostMapping
    public Result<?> addDish(@RequestBody ShiDish dish) {
        dish.setStatus(1);
        dishService.save(dish);
        return Result.success("添加成功", dish.getId());
    }

    /**
     * 更新菜品
     */
    @PutMapping("/{id}")
    public Result<?> updateDish(@PathVariable Long id, @RequestBody ShiDish dish) {
        ShiDish existing = dishService.getById(id);
        if (existing == null) {
            return Result.error(404, "菜品不存在");
        }
        dish.setId(id);
        dishService.updateById(dish);
        return Result.success("更新成功");
    }

    /**
     * 删除菜品
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteDish(@PathVariable Long id) {
        ShiDish existing = dishService.getById(id);
        if (existing == null) {
            return Result.error(404, "菜品不存在");
        }
        existing.setStatus(0);
        dishService.updateById(existing);
        return Result.success("删除成功");
    }
}
