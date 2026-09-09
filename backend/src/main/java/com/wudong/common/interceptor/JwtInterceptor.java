package com.wudong.common.interceptor;

import com.wudong.common.util.JwtUtil;
import com.wudong.common.util.RequestContextUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();

        // 管理员登录接口直接放行
        if (uri.equals("/api/admin/login")) {
            return true;
        }

        // 管理员其他接口需要 token
        if (uri.startsWith("/api/admin")) {
            String token = RequestContextUtil.getTokenFromRequest();
            if (token == null || !jwtUtil.validateToken(token)) {
                response.setStatus(401);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":401,\"message\":\"未登录或token已过期\"}");
                return false;
            }
            request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
            return true;
        }

        // 公开接口
        if (isPublicEndpoint(uri)) {
            String token = RequestContextUtil.getTokenFromRequest();
            if (token != null && jwtUtil.validateToken(token)) {
                request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
            }
            return true;
        }

        // 需要登录的接口
        String token = RequestContextUtil.getTokenFromRequest();
        if (token == null || !jwtUtil.validateToken(token)) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"message\":\"未登录或token已过期\"}");
            return false;
        }
        request.setAttribute("userId", jwtUtil.getUserIdFromToken(token));
        return true;
    }

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