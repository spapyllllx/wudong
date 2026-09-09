package com.wudong.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import cn.hutool.crypto.digest.BCrypt;
import com.wudong.common.result.Result;
import com.wudong.common.util.JwtUtil;
import com.wudong.admin.model.SysAdmin;
import com.wudong.admin.service.SysAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理员认证控制器
 */
@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Autowired
    private SysAdminService sysAdminService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");

        if (username == null || password == null) {
            return Result.error(400, "用户名和密码不能为空");
        }

        SysAdmin admin = sysAdminService.getOne(
            new LambdaQueryWrapper<SysAdmin>()
                .eq(SysAdmin::getUsername, username)
        );

        if (admin == null) {
            return Result.error(401, "用户名或密码错误");
        }

        if (!BCrypt.checkpw(password, admin.getPassword())) {
            return Result.error(401, "用户名或密码错误");
        }

        if (admin.getStatus() == 0) {
            return Result.error(403, "账号已被禁用");
        }

        String token = jwtUtil.generateToken(admin.getId(), admin.getUsername());
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userId", admin.getId());
        data.put("username", admin.getUsername());
        data.put("realName", admin.getRealName());
        
        return Result.success("登录成功", data);
    }
}
