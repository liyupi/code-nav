package com.codenav.mp.server.bean;

import com.codenav.mp.server.constant.CommonConstant;
import com.codenav.mp.server.handler.LoginHandler;
import com.codenav.mp.server.handler.MessageHandler;
import com.codenav.mp.server.handler.SubscribeHandler;
import javax.annotation.Resource;
import me.chanjar.weixin.common.api.WxConsts.EventType;
import me.chanjar.weixin.common.api.WxConsts.XmlMsgType;
import me.chanjar.weixin.mp.api.WxMpMessageRouter;
import me.chanjar.weixin.mp.api.WxMpService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 微信消息路由
 *
 * @author yupili
 */
@Configuration
public class WxMsgRouter {

  @Resource
  private WxMpService wxMpService;

  @Resource
  private LoginHandler loginHandler;

  @Resource
  private MessageHandler messageHandler;

  @Resource
  private SubscribeHandler subscribeHandler;

  @Bean
  public WxMpMessageRouter getWxMsgRouter() {
    WxMpMessageRouter router = new WxMpMessageRouter(wxMpService);
    // 登录
    router.rule()
        .async(false)
        .msgType(XmlMsgType.TEXT)
        .rContent("登录|登陆")
        .handler(loginHandler)
        .end();
    // 收到消息
    router.rule()
        .async(false)
        .msgType(XmlMsgType.TEXT)
        .handler(messageHandler)
        .end();
    // 关注
    router.rule()
        .async(false)
        .msgType(XmlMsgType.EVENT)
        .event(EventType.SUBSCRIBE)
        .handler(subscribeHandler)
        .end();
    // 点击按钮
    router.rule()
        .async(false)
        .msgType(XmlMsgType.EVENT)
        .event(EventType.CLICK)
        .eventKey(CommonConstant.LOGIN_MENU_KEY)
        .handler(loginHandler)
        .end();
    return router;
  }
}
