package com.yupi.codenavmp.server.model;

import java.io.Serializable;

/**
 * @name: GetCaptchaResponse
 * @author: yupili
 * @create: 2021/1/8
 **/
public class GetCaptchaResponse implements Serializable {

  private static final long serialVersionUID = 4200328781716962658L;

  private boolean result;

  private String captcha;

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public String getCaptcha() {
    return captcha;
  }

  public void setCaptcha(String captcha) {
    this.captcha = captcha;
  }

  @Override
  public String toString() {
    return "GetCaptchaResponse{" +
        "result=" + result +
        ", captcha='" + captcha + '\'' +
        '}';
  }
}
