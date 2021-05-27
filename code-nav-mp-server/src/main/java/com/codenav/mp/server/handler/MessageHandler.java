package com.codenav.mp.server.handler;

import java.util.Map;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpMessageHandler;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.springframework.stereotype.Component;

/**
 * 消息处理器
 *
 * @author yupili
 **/
@Component
public class MessageHandler implements WxMpMessageHandler {

  @Override
  public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
      WxMpService wxMpService, WxSessionManager wxSessionManager) throws WxErrorException {
    String content = "不太懂您的问题哦，请添加微信 liyupi66 交流反馈";
    // 根据消息内容给出回复
    switch (wxMpXmlMessage.getContent()) {
      case "领资料":
        content = "关注公众号【程序员鱼皮】领编程学习资源！\n"
            + "<a href=\"https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/yupi_wechat.png\">欢迎关注</a>";
        break;
      case "测试消息":
        content = "哈哈不错";
        break;
      default:
        break;
    }

    return WxMpXmlOutMessage.TEXT().content(content)
        .fromUser(wxMpXmlMessage.getToUser())
        .toUser(wxMpXmlMessage.getFromUser())
        .build();
  }
}
