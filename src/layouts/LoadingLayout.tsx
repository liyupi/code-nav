import React, {useEffect, useState} from 'react';
import {tcbLogin} from "@/tcb";
import {Spin} from "antd";
import Cookies from "js-cookie";
import {LOGIN_STATUS} from "@/constant";
import {ConnectProps, Dispatch, LoginType} from "@@/plugin-dva/connect";
import {connect} from "umi";
import {ConnectState} from "@/models/connect";

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

  const {children, dispatch, userId} = props;

  const [tcbLoading, setTcbLoading] = useState(true);

  function autoLogin() {
    // 自动登录
    if (!userId) {
      // cookie 登录
      let loginStatus: LoginType = Cookies.getJSON(LOGIN_STATUS);
      if (loginStatus && loginStatus.userId) {
        return dispatch({
          type: 'login/login',
          payload: {userId: loginStatus.userId, type: 'auto'},
        });
      }
    }
  }

  useEffect(() => {
    tcbLogin().then(async () => {
      await autoLogin();
    }).catch(e => {
    }).finally(() => {
      setTcbLoading(false);
    })
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

