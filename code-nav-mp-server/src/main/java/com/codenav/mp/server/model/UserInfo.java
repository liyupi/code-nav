package com.yupi.codenavmp.server.model;

import java.io.Serializable;

/**
 * @name: 用户信息
 * @author: yupili
 * @create: 2021/1/8
 **/
public class UserInfo implements Serializable {

  private static final long serialVersionUID = -3598932937566896192L;

  private String province;

  private String nickName;

  private String language;

  private Integer gender;

  private String country;

  private String city;

  private String avatarUrl;

  public String getProvince() {
    return province;
  }

  public void setProvince(String province) {
    this.province = province;
  }

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public Integer getGender() {
    return gender;
  }

  public void setGender(Integer gender) {
    this.gender = gender;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }

  @Override
  public String toString() {
    return "UserInfo{" +
        "province='" + province + '\'' +
        ", nickName='" + nickName + '\'' +
        ", language='" + language + '\'' +
        ", gender=" + gender +
        ", country='" + country + '\'' +
        ", city='" + city + '\'' +
        ", avatarUrl='" + avatarUrl + '\'' +
        '}';
  }
}
