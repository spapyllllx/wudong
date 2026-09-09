package com.wudong.shi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.shi.model.ShiProductCategory;
import com.wudong.shi.service.ShiProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 农产品分类控制器（模块二）
 */
@RestController
@RequestMapping("/api/shi/categories")
public class ShiProductCategoryController {

    @Autowired
    private ShiProductCategoryService categoryService;

    /**
     * 分类列表
     */
    @GetMapping
    public Result<?> listCategories() {
        LambdaQueryWrapper<ShiProductCategory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiProductCategory::getStatus, 1);
        wrapper.orderByAsc(ShiProductCategory::getSortOrder);
        List<ShiProductCategory> categories = categoryService.list(wrapper);
        return Result.success(categories);
    }

    /**
     * 新增分类
     */
    @PostMapping
    public Result<?> addCategory(@RequestBody ShiProductCategory category) {
        category.setStatus(1);
        categoryService.save(category);
        return Result.success("添加成功", category.getId());
    }

    /**
     * 更新分类
     */
    @PutMapping("/{id}")
    public Result<?> updateCategory(@PathVariable Long id, @RequestBody ShiProductCategory category) {
        category.setId(id);
        categoryService.updateById(category);
        return Result.success("更新成功");
    }

    /**
     * 删除分类
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteCategory(@PathVariable Long id) {
        ShiProductCategory existing = categoryService.getById(id);
        if (existing == null) {
            return Result.error(404, "分类不存在");
        }
        existing.setStatus(0);
        categoryService.updateById(existing);
        return Result.success("删除成功");
    }
}
