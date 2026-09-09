package com.wudong.shi.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 餐厅实体
 */
@Data
@TableName("shi_restaurant")
public class ShiRestaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long merchantId;

    private String name;

    private String coverImage;

    private String description;

    private String address;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private String businessHours;

    private Integer maxPeople;

    private BigDecimal rating;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
