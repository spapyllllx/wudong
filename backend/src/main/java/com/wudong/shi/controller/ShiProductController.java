package com.wudong.shi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.shi.model.ShiProduct;
import com.wudong.shi.service.ShiProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 农产品控制器（模块二）
 */
@RestController
@RequestMapping("/api/shi/products")
public class ShiProductController {

    @Autowired
    private ShiProductService productService;

    /**
     * 农产品列表（分页+筛选）
     */
    @GetMapping
    public Result<?> listProducts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer sortBy) {

        LambdaQueryWrapper<ShiProduct> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiProduct::getStatus, 1);
        if (categoryId != null) {
            wrapper.eq(ShiProduct::getCategoryId, categoryId);
        }
        if (merchantId != null) {
            wrapper.eq(ShiProduct::getMerchantId, merchantId);
        }
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(ShiProduct::getName, keyword);
        }
        if (minPrice != null) {
            wrapper.ge(ShiProduct::getPrice, minPrice);
        }
        if (maxPrice != null) {
            wrapper.le(ShiProduct::getPrice, maxPrice);
        }
        // 排序: 1-销量 2-价格升 3-价格降 4-最新
        if (sortBy != null) {
            switch (sortBy) {
                case 2: wrapper.orderByAsc(ShiProduct::getPrice); break;
                case 3: wrapper.orderByDesc(ShiProduct::getPrice); break;
                case 4: wrapper.orderByDesc(ShiProduct::getCreateTime); break;
                default: wrapper.orderByDesc(ShiProduct::getCreateTime); break;
            }
        } else {
            wrapper.orderByDesc(ShiProduct::getCreateTime);
        }

        Page<ShiProduct> pageResult = productService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 农产品详情
     */
    @GetMapping("/{id}")
    public Result<?> getProduct(@PathVariable Long id) {
        ShiProduct product = productService.getById(id);
        if (product == null || product.getStatus() != 1) {
            return Result.error(404, "商品不存在");
        }
        return Result.success(product);
    }

    /**
     * 新增农产品
     */
    @PostMapping
    public Result<?> addProduct(@RequestBody ShiProduct product) {
        product.setStatus(1);
        productService.save(product);
        return Result.success("添加成功", product.getId());
    }

    /**
     * 更新农产品
     */
    @PutMapping("/{id}")
    public Result<?> updateProduct(@PathVariable Long id, @RequestBody ShiProduct product) {
        ShiProduct existing = productService.getById(id);
        if (existing == null) {
            return Result.error(404, "商品不存在");
        }
        product.setId(id);
        productService.updateById(product);
        return Result.success("更新成功");
    }

    /**
     * 删除农产品（软删除）
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteProduct(@PathVariable Long id) {
        ShiProduct existing = productService.getById(id);
        if (existing == null) {
            return Result.error(404, "商品不存在");
        }
        existing.setStatus(0);
        productService.updateById(existing);
        return Result.success("删除成功");
    }
}
