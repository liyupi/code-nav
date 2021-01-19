package com.yupi.codenavmp.server.handler;

import com.yupi.codenavmp.server.constant.CommonConstant;
import com.yupi.codenavmp.server.model.GetCaptchaResponse;
import com.yupi.codenavmp.server.service.CommonService;
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
 * @name: 关注处理器
 * @author: yupili
 * @create: 2021/1/8
 **/
@Component
public class SubscribeHandler implements WxMpMessageHandler {

  @Resource
  private CommonService commonService;

  @Override
  public WxMpXmlOutMessage handle(WxMpXmlMessage wxMpXmlMessage, Map<String, Object> map,
      WxMpService wxMpService, WxSessionManager wxSessionManager) throws WxErrorException {
    // 获取
    GetCaptchaResponse response = commonService.login(wxMpXmlMessage, wxMpService);
    String content;
    if (response == null) {
      content = "获取失败，请稍后重试\n或联系wx: code_nav";
    } else {
      String captcha = response.getCaptcha();
      content = String
          .format(
              "感谢关注编程导航 ✨\n"
                  + "最专业的编程资源站点！\n"
                  + "动态码：%s\n"
                  + "请在十分钟内登录 🕑\n"
                  + "点击下方按钮可重获动态码",
              captcha, directUrl);
    }
    // 调用接口，返回验证码
    return WxMpXmlOutMessage.TEXT().content(content)
        .fromUser(wxMpXmlMessage.getToUser())
        .toUser(wxMpXmlMessage.getFromUser())
        .build();
  }
}
