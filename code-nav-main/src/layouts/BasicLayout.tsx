import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import type { Dispatch} from 'umi';
import { connect, history, Link } from 'umi';
import {
  AppstoreOutlined,
  BarChartOutlined,
  GlobalOutlined,
  HomeOutlined,
  SafetyOutlined,
  SketchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Menu, notification, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import HeaderSearch from '@/components/HeaderSearch';
import GlobalFooter from '@/components/GlobalFooter';
import SubMenu from 'antd/lib/menu/SubMenu';
import type { CurrentUser } from '@/models/user';
import type { ConnectState } from '@/models/connect';
import { stringify } from 'querystring';
import { closeNoticeWatcher, openNoticeWatcher } from '@/services/notice';
import defaultSettings from '../../config/defaultSettings';
import menu from '../../config/menu';
import logo from '../assets/logo.png';
import './BasicLayout.less';

const noMatch = (
  <Result
    status={403}
    title="登录后即可访问"
    extra={
      <Button type="primary" size="large">
        <Link
          to={{
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }}
        >
          一键登录
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
  currentAuthority: string;
  currentUser: CurrentUser;
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
};

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
    currentAuthority,
  } = props;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'tag/get',
      });
    }
    // 公告监听
    openNoticeWatcher((notice) => {
      const { title, content } = notice;
      notification.info({
        message: title,
        description: content,
        top: 64,
        duration: 10,
      });
    });
    return () => {
      closeNoticeWatcher();
    };
  }, []);

  useEffect(() => {
    if (dispatch && userId && !currentUser._id) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {
          userId,
        },
      });
    }
  }, []);

  // get current page needed authority
  let authority;

  route.routes?.forEach((r) => {
    if (r.path === location.pathname) {
      authority = r.authority;
    }
  });

  return (
    <ProLayout
      logo={logo}
      {...props}
      {...defaultSettings}
      layout="side"
      navTheme="realDark"
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      footerRender={() => <GlobalFooter />}
      menuDataRender={() => menuDataRender(menu)}
      headerContentRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname ?? '/']}
            onClick={({ key }) => history.push(key)}
            style={{ height: '100%', border: 0 }}
          >
            {currentUser._id && (
              <Menu.Item key="/account/info" icon={<HomeOutlined />}>
                个人
              </Menu.Item>
            )}
            <Menu.Item key="/recommend" icon={<SketchOutlined />}>
              发现
            </Menu.Item>
            <Menu.Item key="/resources" icon={<AppstoreOutlined />}>
              资源
            </Menu.Item>
            <SubMenu key="/world" icon={<GlobalOutlined />} title="世界">
              <Menu.Item key="/friend" icon={<UserAddOutlined />}>
                找伙伴
              </Menu.Item>
              <Menu.Item key="/ranking" icon={<BarChartOutlined />}>
                激励榜
              </Menu.Item>
            </SubMenu>
            {currentUser._id && currentAuthority.includes('admin') && (
              <SubMenu key="/review" icon={<SafetyOutlined />} title="运营">
                <Menu.Item key="/review/resource">审核资源</Menu.Item>
                <Menu.Item key="/review/comment">审核评论</Menu.Item>
                <Menu.Item key="/review/report">审核举报</Menu.Item>
                <Menu.Item key="/review/notice">公告管理</Menu.Item>
              </SubMenu>
            )}
          </Menu>
          <div className="header-search-bar">
            <HeaderSearch placeholder="全站搜索编程资源" />
          </div>
        </div>
      )}
      rightContentRender={() => <RightContent />}
    >
      <Authorized authority={authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ login, user }: ConnectState) => ({
  currentUser: user.currentUser,
  userId: login.userId,
  currentAuthority: login.currentAuthority,
}))(BasicLayout);
