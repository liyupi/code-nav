import React, {useEffect, useState} from 'react';
import {tcbLogin} from "@/tcb";
import {message, Spin} from "antd";
import Cookies from "js-cookie";
import {DYNAMIC_CAPTCHA, LOGIN_STATUS} from "@/constant";
import type {ConnectProps, Dispatch, LoginType} from "@@/plugin-dva/connect";
import {connect} from "umi";
import type {ConnectState} from "@/models/connect";

interface LoadingLayoutProps extends Partial<ConnectProps> {
  dispatch: Dispatch;
  userId?: string;
}

/**
 * 页面全局加载模板
 * @constructor
 * @param props
 */
const LoadingLayout: React.FC<LoadingLayoutProps> = (props) => {

  const {children, dispatch, userId, location = {query: {}}} = props;

  const [tcbLoading, setTcbLoading] = useState(true);

  // eslint-disable-next-line consistent-return
  function autoLogin() {
    // 自动登录
    if (!userId) {
      // 存在登录态 cookie 或者 url 携带 captcha 参数
      const captcha = location.query[DYNAMIC_CAPTCHA];
      if (captcha) {
        return dispatch({
          type: 'login/login',
          payload: {captcha, type: 'url'},
        });
      }
      const loginStatus: LoginType = Cookies.getJSON(LOGIN_STATUS);
      if (loginStatus && loginStatus.userId) {
        return dispatch({
          type: 'login/login',
          payload: {userId: loginStatus.userId, type: 'auto'},
        });
      }
    }
  }

  useEffect(() => {
    tcbLogin()
      .then(async () => {
        await autoLogin();
      })
      .catch((err) => {
        console.error('tcbLogin error', err);
        message.error('网络连接失败，请刷新重试！');
      })
      .finally(() => {
        setTcbLoading(false);
      });
  }, [])

  return tcbLoading ?
    <div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <Spin size='large' />
    </div>
    : <>{children}</>;
}

export default connect(({login}: ConnectState) => ({
  userId: login.userId,
}))(LoadingLayout);

