package com.wudong.shi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wudong.common.result.Result;
import com.wudong.shi.model.ShiSeatSlot;
import com.wudong.shi.service.ShiSeatSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 餐位时段控制器（模块二）
 */
@RestController
@RequestMapping("/api/shi/seat-slots")
public class ShiSeatSlotController {

    @Autowired
    private ShiSeatSlotService seatSlotService;

    /**
     * 获取餐厅的可用时段列表
     */
    @GetMapping
    public Result<?> listSeatSlots(
            @RequestParam Long restaurantId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        LambdaQueryWrapper<ShiSeatSlot> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShiSeatSlot::getRestaurantId, restaurantId);
        wrapper.eq(ShiSeatSlot::getStatus, 1);
        wrapper.orderByAsc(ShiSeatSlot::getStartTime);

        Page<ShiSeatSlot> pageResult = seatSlotService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    /**
     * 新增时段
     */
    @PostMapping
    public Result<?> addSeatSlot(@RequestBody ShiSeatSlot slot) {
        slot.setStatus(1);
        seatSlotService.save(slot);
        return Result.success("添加成功", slot.getId());
    }

    /**
     * 更新时段
     */
    @PutMapping("/{id}")
    public Result<?> updateSeatSlot(@PathVariable Long id, @RequestBody ShiSeatSlot slot) {
        ShiSeatSlot existing = seatSlotService.getById(id);
        if (existing == null) {
            return Result.error(404, "时段不存在");
        }
        slot.setId(id);
        seatSlotService.updateById(slot);
        return Result.success("更新成功");
    }

    /**
     * 删除时段（软删除）
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteSeatSlot(@PathVariable Long id) {
        ShiSeatSlot existing = seatSlotService.getById(id);
        if (existing == null) {
            return Result.error(404, "时段不存在");
        }
        existing.setStatus(0);
        seatSlotService.updateById(existing);
        return Result.success("删除成功");
    }
}
