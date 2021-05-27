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
 * 关注处理器
 *
 * @author yupili
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
      String directUrl = String.format("%s?dc=%s", CommonConstant.WEB_HOST, captcha);
      String passageUrl = "https://mp.weixin.qq.com/s/EPo9JqJPcoJp2JkK2Qwi0w";
      String gitHubUrl = "https://github.com/liyupi/code-nav";
      content = String
          .format(
              "感谢关注编程导航 ✨\n"
                  + "<a href=\"%s\">最专业的编程资源站点！</a>\n"
                  + "动态码：%s\n"
                  + "请在十分钟内登录 🕑\n"
                  + "或直接访问：<a href=\"%s\">编程导航</a>\n"
                  + "点下方一键登录可重获动态码\n"
                  + "代码已开源：<a href=\"%s\">欢迎star</a> ⭐",
              passageUrl, captcha, directUrl, gitHubUrl);
    }
    // 调用接口，返回验证码
    return WxMpXmlOutMessage.TEXT().content(content)
        .fromUser(wxMpXmlMessage.getToUser())
        .toUser(wxMpXmlMessage.getFromUser())
        .build();
  }
}
