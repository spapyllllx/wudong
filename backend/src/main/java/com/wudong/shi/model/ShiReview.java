package com.wudong.shi.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 评价实体
 */
@Data
@TableName("shi_review")
public class ShiReview implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;

    private Long restaurantId;

    private Long productId;

    private Long userId;

    private Integer rating;

    private String content;

    private String images;

    private String replyContent;

    private LocalDateTime replyTime;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}