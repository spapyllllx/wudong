package com.wudong.common.interceptor;

import com.wudong.common.util.JwtUtil;
import com.wudong.common.util.RequestContextUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * JWT拦截器
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 跨域预检请求直接通过
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        String token = RequestContextUtil.getTokenFromRequest();
        
        // 管理员接口需要单独验证
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/admin")) {
            if (token == null || !jwtUtil.validateToken(token)) {
                response.setStatus(401);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":401,\"message\":\"未登录或token已过期\"}");
                return false;
            }
            request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
            return true;
        }

        // 用户接口（部分接口不需要登录，如登录、注册、浏览商品等）
        if (isPublicEndpoint(uri)) {
            if (token != null && jwtUtil.validateToken(token)) {
                request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
            }
            return true;
        }

        // 需要登录的接口
        if (token == null || !jwtUtil.validateToken(token)) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"message\":\"未登录或token已过期\"}");
            return false;
        }

        request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
        return true;
    }

    /**
     * 判断是否为公开接口（无需登录）
     */
    private boolean isPublicEndpoint(String uri) {
        return uri.equals("/api/auth/login") 
            || uri.equals("/api/auth/register")
            || uri.equals("/api/auth/sms-code")
            || uri.startsWith("/api/yi/products")
            || uri.startsWith("/api/yi/categories")
            || uri.startsWith("/api/shi/")
            || uri.startsWith("/api/zhu/homestays")
            || uri.startsWith("/api/xing/scenics")
            || uri.startsWith("/api/xing/routes")
            || uri.startsWith("/api/xing/transport-guides")
            || uri.startsWith("/api/shequ/logs")
            || uri.startsWith("/api/shequ/topics")
            || uri.startsWith("/api/shequ/users")
            || uri.startsWith("/api/common/");
    }
}
