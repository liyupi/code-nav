package com.yupi.codenavmp.server.handler;

import com.yupi.codenavmp.server.constant.CommonConstant;
import com.yupi.codenavmp.server.model.GetCaptchaResponse;
import com.yupi.codenavmp.server.service.CommonService;
import java.util.Date;
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
 * @name: 登录处理器
 * @author: yupili
 * @create: 2021/1/8
 **/
@Component
public class LoginHandler implements WxMpMessageHandler {

  @Resource
  private CommonService commonService;

  @Override
  public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
      WxMpService wxMpService, WxSessionManager wxSessionManager) throws WxErrorException {
    // 获取
    GetCaptchaResponse response = commonService.login(wxMpXmlMessage, wxMpService);
    String content;
    if (response == null) {
      content = "获取失败，请稍后重试\n";
    } else {
      String captcha = response.getCaptcha();
      content = String.format("动态码：%s\n请在十分钟内登录", captcha);
    }
    // 调用接口，返回验证码
    return WxMpXmlOutMessage.TEXT().content(content)
        .fromUser(wxMpXmlMessage.getToUser())
        .toUser(wxMpXmlMessage.getFromUser())
        .build();
  }
}
