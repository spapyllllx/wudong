package com.wudong.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wudong.user.model.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 用户Mapper
 */
@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {

    @Select("SELECT * FROM sys_user WHERE phone = #{phone}")
    SysUser findByPhone(@Param("phone") String phone);

    @Select("SELECT * FROM sys_user WHERE openid = #{openid}")
    SysUser findByOpenid(@Param("openid") String openid);

    @Select("SELECT COUNT(1) FROM sys_user WHERE phone = #{phone}")
    Integer countByPhone(@Param("phone") String phone);
}
