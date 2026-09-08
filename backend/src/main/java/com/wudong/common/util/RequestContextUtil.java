package com.wudong.common.util;

import javax.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 上下文工具类
 */
public class RequestContextUtil {

    /**
     * 获取当前请求的HttpServletRequest
     */
    public static HttpServletRequest getRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            return attrs.getRequest();
        }
        return null;
    }

    /**
     * 从RequestHeader中获取Token
     */
    public static String getTokenFromRequest() {
        HttpServletRequest request = getRequest();
        if (request == null) {
            return null;
        }
        // 先从Header获取
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        // 再从参数获取
        token = request.getParameter("token");
        return token;
    }
}
