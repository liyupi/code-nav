package com.yupi.codenavmp.server.service;

import com.yupi.codenavmp.server.model.GetCaptchaResponse;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;

/**
 * @name: 服务
 * @author: yupili
 * @create: 2021/1/8
 **/
public interface CommonService {

  /**
   * 登录
   * @param wxMpXmlMessage
   * @param wxMpService
   * @return
   */
  GetCaptchaResponse login(WxMpXmlMessage wxMpXmlMessage, WxMpService wxMpService)
      throws WxErrorException;
}
