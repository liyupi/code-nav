package com.yupi.codenavmp.server.controller;

import com.google.common.collect.Lists;

import com.yupi.codenavmp.server.constant.CommonConstant;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import me.chanjar.weixin.common.api.WxConsts.MenuButtonType;
import me.chanjar.weixin.common.bean.menu.WxMenu;
import me.chanjar.weixin.common.bean.menu.WxMenuButton;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpMessageRouter;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @name: WxController
 * @author: yupili
 * @create: 2021/1/8
 **/
@RestController
@RequestMapping("/")
public class WxController {

  private static final Logger LOGGER = LoggerFactory.getLogger(WxController.class);

  @Resource
  private WxMpService mpService;

  @Resource
  private WxMpMessageRouter router;

  @PostMapping("/")
  public void receiveMessage(HttpServletRequest request, HttpServletResponse response)
      throws IOException, WxErrorException {
    response.setContentType("text/html;charset=utf-8");
    response.setStatus(HttpServletResponse.SC_OK);
    // 校验消息签名，判断是否为公众平台发的消息
    String signature = request.getParameter("signature");
    String nonce = request.getParameter("nonce");
    String timestamp = request.getParameter("timestamp");
    if (!mpService.checkSignature(timestamp, nonce, signature)) {
      response.getWriter().println("非法请求");
    }
    // 加密类型
    String encryptType = StringUtils.isBlank(request.getParameter("encrypt_type")) ? "raw"
        : request.getParameter("encrypt_type");
    // 明文消息
    if ("raw".equals(encryptType)) {
      return;
    }
    // aes 加密消息
    if ("aes".equals(encryptType)) {
      // 解密消息
      String msgSignature = request.getParameter("msg_signature");
      WxMpXmlMessage inMessage = WxMpXmlMessage
          .fromEncryptedXml(request.getInputStream(), mpService.getWxMpConfigStorage(), timestamp,
              nonce,
              msgSignature);
      LOGGER.info("message content = {}", inMessage.getContent());
      // 路由消息并处理
      WxMpXmlOutMessage outMessage = router.route(inMessage);
      if (outMessage == null) {
        response.getWriter().write("");
      } else {
        response.getWriter().write(outMessage.toEncryptedXml(mpService.getWxMpConfigStorage()));
      }
      return;
    }
    response.getWriter().println("不可识别的加密类型");
  }

  @GetMapping("/")
  public String check(String timestamp, String nonce, String signature, String echostr)
      throws WxErrorException {
    LOGGER.info("check");
    if (mpService.checkSignature(timestamp, nonce, signature)) {
      return echostr;
    } else {
      return "";
    }
  }

}
