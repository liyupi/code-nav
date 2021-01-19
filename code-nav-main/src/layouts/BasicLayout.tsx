import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, {useEffect} from 'react';
import {Link, connect, Dispatch, history} from 'umi';
import {GithubOutlined} from '@ant-design/icons';
import {Result, Button, Affix, Tooltip} from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import defaultSettings from '../../config/defaultSettings';
import {AppstoreAddOutlined, WechatOutlined} from "@ant-design/icons/lib";
import menu from '../../config/menu';
import logo from '../assets/logo.png';
import wechat from '../assets/wechat.jpeg';
import {ConnectState} from "@/models/connect";
import {CurrentUser} from "@/models/user";
import {stringify} from "querystring";

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="该页面需要登录才能访问哦"
    extra={
      <Button type="primary" size="large">
        <Link to={{
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          })
        }}>
          登录
        </Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  dispatch: Dispatch;
  userId?: string;
  currentUser?: CurrentUser;
}

/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
}


const defaultFooterDom = (
  <DefaultFooter
    copyright={`2021 编程导航`}
    links={[
      {
        key: 'github',
        title: <><GithubOutlined /> 支持项目</>,
        href: 'https://github.com/liyupi/code-nav',
        blankTarget: true,
      },
      {
        key: 'contact',
        title: <Tooltip title={<img src={wechat} alt="微信 code_nav" width="200" />}><WechatOutlined /> 联系作者</Tooltip>,
        href: 'https://github.com/liyupi/code-nav/blob/master/README.md#%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%85',
        blankTarget: false,
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    route,
    location = {
      pathname: '/',
    },
    userId,
    currentUser,
  } = props;

  useEffect(() => {
    if (dispatch && userId && !currentUser) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {
          userId,
        }
      });
    }
  }, []);

  // get current page needed authority
  let authority = undefined;

  route.routes?.forEach(route => {
    if (route.path === location.pathname) {
      authority = route.authority;
    }
  })

  return (
    <ProLayout
      logo={logo}
      {...props}
      {...defaultSettings}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={() => menuDataRender(menu)}
      rightContentRender={() => <RightContent />}
    >
      <Authorized authority={authority} noMatch={noMatch}>
        {children}
      </Authorized>
      {
        location.pathname !== '/addResource' &&
        <Affix style={{position: 'fixed', bottom: 24, right: 24}}>
          <Link to="/addResource">
            <Tooltip title="推荐资源，收获积分和人气" placement="topLeft">
              <Button type="primary" shape="circle" icon={<AppstoreAddOutlined />} style={{width: 50, height: 50}} />
            </Tooltip>
          </Link>
        </Affix>
      }
    </ProLayout>
  );
};

export default connect(({login, user}: ConnectState) => ({
  currentUser: user.currentUser,
  userId: login.userId,
}))(BasicLayout);
