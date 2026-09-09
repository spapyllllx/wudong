package com.wudong.shi.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wudong.shi.mapper.ShiDishMapper;
import com.wudong.shi.model.ShiDish;
import org.springframework.stereotype.Service;

/**
 * 菜品服务
 */
@Service
public class ShiDishService extends ServiceImpl<ShiDishMapper, ShiDish> {
}
