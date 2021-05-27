package com.codenav.mp.server.service;

import com.codenav.mp.server.constant.CommonConstant;
import com.codenav.mp.server.model.GetCaptchaResponse;
import com.codenav.mp.server.model.UserInfo;
import com.codenav.mp.server.utils.HttpUtils;
import com.google.gson.Gson;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 公共服务实现类
 *
 * @author yupili
 **/
@Service
public class CommonServiceImpl implements CommonService {

  private static final Logger LOGGER = LoggerFactory.getLogger(CommonServiceImpl.class);

  private final Gson gson = new Gson();

  @Override
  public GetCaptchaResponse login(WxMpXmlMessage wxMpXmlMessage, WxMpService wxMpService)
      throws WxErrorException {
    // 封装请求参数
    WxMpUser wxMpUser = wxMpService.getUserService().userInfo(wxMpXmlMessage.getFromUser());
    String unionId = wxMpUser.getUnionId();
    String mpOpenId = wxMpUser.getOpenId();
    Map<String, String> params = new HashMap<>();
    params.put("userInfo", gson.toJson(getUserInfo(wxMpUser)));
    params.put("from", CommonConstant.FROM);
    params.put("mpOpenId", mpOpenId);
    params.put("unionId", unionId);
    String url = CommonConstant.WEB_HOST + "/get_captcha";
    // 通过 HTTP 调用云函数，获取动态码
    try {
      String jsonResult = HttpUtils.doGet(url, params);
      if (jsonResult == null) {
        return null;
      }
      return gson.fromJson(jsonResult, GetCaptchaResponse.class);
    } catch (URISyntaxException e) {
      LOGGER.error("login error", e);
    }
    return null;
  }

  /**
   * 封装用户信息
   *
   * @param wxMpUser
   * @return
   */
  private UserInfo getUserInfo(WxMpUser wxMpUser) {
    UserInfo userInfo = new UserInfo();
    userInfo.setProvince(wxMpUser.getProvince());
    userInfo.setNickName(wxMpUser.getNickname());
    userInfo.setLanguage(wxMpUser.getLanguage());
    userInfo.setGender(wxMpUser.getSex());
    userInfo.setCountry(wxMpUser.getCountry());
    userInfo.setAvatarUrl(wxMpUser.getHeadImgUrl());
    userInfo.setCity(wxMpUser.getCity());
    return userInfo;
  }
}
