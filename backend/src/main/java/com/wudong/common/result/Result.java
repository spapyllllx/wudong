package com.wudong.common.result;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一响应结果
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;
    private T data;

    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        return result;
    }

    public static <T> Result<T> success(String message, T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> error(String message) {
        return error(500, message);
    }

    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        return error(resultCode.getCode(), resultCode.getMessage());
    }

    public enum ResultCode {
        SUCCESS(200, "success"),
        BAD_REQUEST(400, "参数错误"),
        UNAUTHORIZED(401, "未登录或token已过期"),
        FORBIDDEN(403, "无权限"),
        NOT_FOUND(404, "资源不存在"),
        INTERNAL_ERROR(500, "服务器内部错误"),
        PARAM_ERROR(400, "参数错误"),
        USERNAME_ALREADY_EXISTS(400, "用户名已存在"),
        PHONE_ALREADY_EXISTS(400, "手机号已注册"),
        PASSWORD_ERROR(401, "密码错误"),
        ORDER_NOT_FOUND(404, "订单不存在"),
        PRODUCT_NOT_FOUND(404, "商品不存在"),
        PRODUCT_OUT_OF_STOCK(400, "商品库存不足"),
        PAYMENT_FAILED(500, "支付失败"),
        IMAGE_UPLOAD_FAILED(500, "图片上传失败"),
        CONTENT_AUDIT_PENDING(400, "内容审核中");
        
        private final Integer code;
        private final String message;

        ResultCode(Integer code, String message) {
            this.code = code;
            this.message = message;
        }

        public Integer getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }
    }
}
