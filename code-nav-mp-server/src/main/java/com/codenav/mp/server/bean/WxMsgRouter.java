package com.yupi.codenavmp.server.bean;

import com.yupi.codenavmp.server.handler.LoginHandler;
import com.yupi.codenavmp.server.handler.SubscribeHandler;
import java.awt.Event;
import java.util.Map;
import javax.annotation.Resource;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.api.WxConsts.EventType;
import me.chanjar.weixin.common.api.WxConsts.XmlMsgType;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpMessageHandler;
import me.chanjar.weixin.mp.api.WxMpMessageRouter;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WxMsgRouter {

  @Resource
  private WxMpService wxMpService;

  @Resource
  private LoginHandler loginHandler;

  @Resource
  private SubscribeHandler subscribeHandler;

  @Bean
  public WxMpMessageRouter getWxMsgRouter() {
    WxMpMessageRouter router = new WxMpMessageRouter(wxMpService);
    // 消息
    router.rule()
        .async(false)
        .msgType(XmlMsgType.TEXT)
        .rContent("登录|登陆")
        .handler(loginHandler)
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
        .handler(loginHandler)
        .end();
    return router;
  }
}
