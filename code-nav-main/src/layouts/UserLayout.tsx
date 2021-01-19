import { DefaultFooter, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, ConnectProps, connect } from 'umi';
import React from 'react';
import defaultSettings from "../../config/defaultSettings";
import logo from '../assets/logo.png';
import styles from './UserLayout.less';
import { GithubOutlined } from "@ant-design/icons";
import {Tooltip} from "antd";
import wechat from "@/assets/wechat.jpeg";
import {WechatOutlined} from "@ant-design/icons/lib";

export interface UserLayoutProps extends Partial<ConnectProps> {
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const title = getPageTitle({
    pathname: location.pathname,
    ...defaultSettings,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>编程导航</span>
              </Link>
            </div>
            <div className={styles.desc}>发现优质编程学习资源</div>
          </div>
          {children}
        </div>
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
              title: <Tooltip title={<img src={wechat} alt="微信 code_nav" width="200"/>}><WechatOutlined /> 联系作者</Tooltip>,
              href: 'https://github.com/liyupi/code-nav/blob/master/README.md#%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%85',
              blankTarget: false,
            },
          ]}
        />
      </div>
    </HelmetProvider>
  );
};

export default connect()(UserLayout);
