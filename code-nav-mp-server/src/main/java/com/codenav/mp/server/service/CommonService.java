package com.codenav.mp.server.service;

import com.codenav.mp.server.model.GetCaptchaResponse;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;

/**
 * 公共服务
 *
 * @author yupili
 **/
public interface CommonService {

  /**
   * 登录
   *
   * @param wxMpXmlMessage
   * @param wxMpService
   * @return
   */
  GetCaptchaResponse login(WxMpXmlMessage wxMpXmlMessage, WxMpService wxMpService)
      throws WxErrorException;
}
