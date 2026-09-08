package com.wudong.admin.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wudong.admin.mapper.SysAdminMapper;
import com.wudong.admin.model.SysAdmin;
import org.springframework.stereotype.Service;

/**
 * 管理员服务
 */
@Service
public class SysAdminService extends ServiceImpl<SysAdminMapper, SysAdmin> {
}
