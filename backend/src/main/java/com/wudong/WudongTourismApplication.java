package com.wudong;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.wudong.*.mapper")
public class WudongTourismApplication {

    public static void main(String[] args) {
        SpringApplication.run(WudongTourismApplication.class, args);
        System.out.println("========================================");
        System.out.println("    乌东文旅平台启动成功！");
        System.out.println("    端口: 8080");
        System.out.println("    API文档: http://localhost:8080/doc.html");
        System.out.println("========================================");
    }
}
