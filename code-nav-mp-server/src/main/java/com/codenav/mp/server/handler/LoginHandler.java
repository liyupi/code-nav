package com.codenav.mp.server.handler;

import com.codenav.mp.server.constant.CommonConstant;
import com.codenav.mp.server.model.GetCaptchaResponse;
import com.codenav.mp.server.service.CommonService;
import java.util.Map;
import javax.annotation.Resource;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpMessageHandler;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.springframework.stereotype.Component;

/**
 * 登录处理器
 *
 * @author yupili
 **/
@Component
public class LoginHandler implements WxMpMessageHandler {

  @Resource
  private CommonService commonService;

  @Override
  public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
      WxMpService wxMpService, WxSessionManager wxSessionManager) throws WxErrorException {
    // 获取动态码
    GetCaptchaResponse response = commonService.login(wxMpXmlMessage, wxMpService);
    String content;
    if (response == null) {
      content = "获取失败，请稍后重试\n或联系wx: code_nav";
    } else {
      String captcha = response.getCaptcha();
      String directUrl = String.format("%s?dc=%s", CommonConstant.WEB_HOST, captcha);
      content = String
          .format("动态码：%s\n请在十分钟内登录 🕑\n或直接访问：<a href=\"%s\">编程导航</a>", captcha, directUrl);
    }
    // 调用接口，返回验证码
    return WxMpXmlOutMessage.TEXT().content(content)
        .fromUser(wxMpXmlMessage.getToUser())
        .toUser(wxMpXmlMessage.getFromUser())
        .build();
  }
}
