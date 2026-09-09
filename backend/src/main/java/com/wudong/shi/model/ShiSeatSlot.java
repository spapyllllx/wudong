package com.wudong.shi.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 餐位时段实体
 */
@Data
@TableName("shi_seat_slot")
public class ShiSeatSlot implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long restaurantId;

    private String slotName;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer maxBookings;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
