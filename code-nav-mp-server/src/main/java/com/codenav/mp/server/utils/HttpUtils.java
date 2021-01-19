package com.yupi.codenavmp.server.utils;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.Map;
import java.util.Map.Entry;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @name: Http 请求工具类
 * @author: yupili
 * @create: 2021/1/8
 **/
public class HttpUtils {

  private static final Logger LOGGER = LoggerFactory.getLogger(HttpUtils.class);

  /**
   * Get 请求
   *
   * @param url
   * @param params
   * @return Json String
   * @throws URISyntaxException
   */
  public static String doGet(String url, Map<String, String> params) throws URISyntaxException {
    CloseableHttpClient httpClient = HttpClients.createDefault();
    // 设置请求
    URIBuilder uriBuilder = new URIBuilder(url);
    for (Entry<String, String> entry : params.entrySet()) {
      uriBuilder.setParameter(entry.getKey(), entry.getValue());
    }
    HttpGet httpGet = new HttpGet(uriBuilder.build());
    // 请求
    CloseableHttpResponse httpResponse = null;
    try {
      System.out.println("exec start");
      System.out.println(new Date());
      httpResponse = httpClient.execute(httpGet);
      System.out.println("exec end");
      System.out.println(new Date());
      if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
        return EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
      }
    } catch (Exception e) {
      LOGGER.error("doGet error, url = " + url, e);
    } finally {
      // 释放连接
      if (null != httpResponse) {
        try {
          httpResponse.close();
          httpClient.close();
        } catch (IOException ignored) {
        }
      }
    }
    return null;
  }
}
