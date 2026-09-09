package com.wudong.yi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.yi.model.YiProduct;
import com.wudong.yi.service.YiProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 非遗商品控制器（模块一）
 */
@RestController
@RequestMapping("/api/yi/products")
public class YiProductController {

    @Autowired
    private YiProductService yiProductService;

    /**
     * 商品列表（分页+筛选）
     */
    @GetMapping
    public Result<?> listProducts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer sortBy) {

        LambdaQueryWrapper<YiProduct> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(YiProduct::getStatus, 1);
        if (categoryId != null) {
            wrapper.eq(YiProduct::getCategoryId, categoryId);
        }
        if (minPrice != null) {
            wrapper.ge(YiProduct::getPrice, minPrice);
        }
        if (maxPrice != null) {
            wrapper.le(YiProduct::getPrice, maxPrice);
        }
        // 排序: 1-销量 2-评分 3-价格升 4-价格降
        if (sortBy != null) {
            switch (sortBy) {
                case 1: wrapper.orderByDesc(YiProduct::getSales); break;
                case 2: wrapper.orderByDesc(YiProduct::getRating); break;
                case 3: wrapper.orderByAsc(YiProduct::getPrice); break;
                case 4: wrapper.orderByDesc(YiProduct::getPrice); break;
                default: wrapper.orderByDesc(YiProduct::getCreateTime); break;
            }
        } else {
            wrapper.orderByDesc(YiProduct::getCreateTime);
        }

        Page<YiProduct> pageResult = yiProductService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 商品详情
     */
    @GetMapping("/{id}")
    public Result<?> getProduct(@PathVariable Long id) {
        YiProduct product = yiProductService.getById(id);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }
        return Result.success(product);
    }
}
