package com.wudong.yi.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 非遗商品实体
 */
@Data
@TableName("yi_product")
public class YiProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long categoryId;

    private Long merchantId;

    private String title;

    private String subtitle;

    private String mainImage;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer stock;

    private Integer sales;

    private BigDecimal rating;

    private String craftIntroduction;

    private Long inheritorId;

    private String description;

    private Integer status;

    private Long freightTemplateId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
