package com.wudong.shi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.shi.model.ShiReview;
import com.wudong.shi.service.ShiReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 评价控制器（模块二）
 */
@RestController
@RequestMapping("/api/shi/reviews")
public class ShiReviewController {

    @Autowired
    private ShiReviewService reviewService;

    /**
     * 获取餐厅的评价列表
     */
    @GetMapping
    public Result<?> listReviews(
            @RequestParam Long restaurantId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        LambdaQueryWrapper<ShiReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiReview::getRestaurantId, restaurantId);
        wrapper.orderByDesc(ShiReview::getCreateTime);

        Page<ShiReview> pageResult = reviewService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 获取农产品的评价列表
     */
    @GetMapping("/product")
    public Result<?> listProductReviews(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        LambdaQueryWrapper<ShiReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiReview::getProductId, productId);
        wrapper.orderByDesc(ShiReview::getCreateTime);

        Page<ShiReview> pageResult = reviewService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 提交评价
     */
    @PostMapping
    public Result<?> addReview(@RequestBody ShiReview review) {
        review.setStatus(1);
        reviewService.save(review);
        return Result.success("评价成功", review.getId());
    }

    /**
     * 商家回复评价
     */
    @PutMapping("/{id}/reply")
    public Result<?> replyReview(@PathVariable Long id, @RequestBody ShiReview review) {
        ShiReview existing = reviewService.getById(id);
        if (existing == null) {
            return Result.error(404, "评价不存在");
        }
        existing.setReplyContent(review.getReplyContent());
        reviewService.updateById(existing);
        return Result.success("回复成功");
    }
}
