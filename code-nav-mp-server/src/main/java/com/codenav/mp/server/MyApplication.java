package com.codenav.mp.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 启动类（编程导航微信公众号服务端）
 *
 * @author 程序员鱼皮
 * @desc 分享编程学习经验
 **/
@RestController
@RequestMapping("/")
@SpringBootApplication
public class MyApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyApplication.class, args);
  }

}
