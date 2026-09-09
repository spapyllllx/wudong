package com.wudong.shi.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wudong.shi.mapper.ShiProductMapper;
import com.wudong.shi.model.ShiProduct;
import org.springframework.stereotype.Service;

/**
 * 农产品服务
 */
@Service
public class ShiProductService extends ServiceImpl<ShiProductMapper, ShiProduct> {
}