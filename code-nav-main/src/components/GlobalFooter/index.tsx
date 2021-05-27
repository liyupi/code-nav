import { DefaultFooter } from '@ant-design/pro-layout';
import { Tooltip } from 'antd';
import { GithubOutlined, InfoCircleOutlined, WechatOutlined } from '@ant-design/icons';
import wechat from '@/assets/wechat.jpeg';
import React from 'react';

const GlobalFooter: React.FC = () => {
  return (
    <DefaultFooter
      copyright="2021 编程导航 | 沪ICP备19026706号-2"
      links={[
        {
          key: 'github',
          title: (
            <Tooltip title="查看本站技术及源码，欢迎 star">
              <GithubOutlined /> 支持项目
            </Tooltip>
          ),
          href: 'https://github.com/liyupi/code-nav',
          blankTarget: true,
        },
        {
          key: 'contact',
          title: (
            <Tooltip title={<img src={wechat} alt="微信 code_nav" width="200" />}>
              <WechatOutlined /> 联系作者
            </Tooltip>
          ),
          href: 'https://doc.code-nav.cn/author',
          blankTarget: true,
        },
        {
          key: 'info',
          title: (
            <>
              <InfoCircleOutlined /> 免责声明
            </>
          ),
          href: 'https://doc.code-nav.cn/#%E5%85%8D%E8%B4%A3%E5%A3%B0%E6%98%8E',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default GlobalFooter;
