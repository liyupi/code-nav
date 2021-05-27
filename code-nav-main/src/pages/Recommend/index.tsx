import { Button, Empty, List } from 'antd';
import React, { Component } from 'react';
import type { ConnectState } from '@/models/connect';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Link } from 'umi';
import ResourceCard from '@/components/ResourceCard';
import type { ResourceType } from '@/models/resource';
import { listRecommendResources, searchResources } from '@/services/resource';
import type { CurrentUser } from '@/models/user';
import { history } from '@@/core/history';
import reviewStatusEnum from '@/constant/reviewStatusEnum';
import './style.less';

interface RecommendProps {
  currentUser?: CurrentUser;
}

interface RecommendState {
  resources: ResourceType[];
  loading: boolean;
}

const listGrid = {
  gutter: 16,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3,
  xxl: 3,
};

class Recommend extends Component<RecommendProps, RecommendState> {
  state = {
    resources: [],
    loading: true,
  };

  componentDidMount() {
    this.doLoadMore();
  }

  doLoadMore = async () => {
    this.setState({
      loading: true,
    });
    const newResources = await searchResources({
      reviewStatus: reviewStatusEnum.PASS,
      pageSize: 4,
    });
    const recommendResources = await listRecommendResources(12);
    this.setState({
      resources: [...newResources, ...recommendResources],
      loading: false,
    });
  };

  render() {
    const { resources, loading } = this.state;

    const { currentUser = {} as CurrentUser } = this.props;

    const loadMore = !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 40,
          columnSpan: 'all',
        }}
      >
        {!currentUser._id ? (
          <Button type="primary" size="large">
            <Link to="/user/login">点击登录 查看更多</Link>
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={() => {
              history.push(`/resources/`);
            }}
          >
            更多请前往资源大全
          </Button>
        )}
      </div>
    ) : null;

    return (
      <PageContainer
        title="发现资源 ✨"
        content={
          <div>
            站长是腾讯全栈 & 云开发高级布道师，点击关注他的 &nbsp;
            <a
              href="https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/yupi_wechat.png"
              target="_blank"
              rel="noreferrer"
            >
              微信公众号【程序员鱼皮】
            </a>
            ，领取 <strong>6T</strong> 私密编程资源！️
          </div>
        }
      >
        <List<ResourceType>
          rowKey="_id"
          loading={loading}
          dataSource={resources}
          loadMore={loadMore}
          grid={listGrid}
          renderItem={(item) => {
            return (
              <List.Item key={item._id}>
                <ResourceCard resource={item} loading={loading} />
              </List.Item>
            );
          }}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无资源">
                <Link to="/addResource">
                  <Button type="primary" size="large">
                    推荐资源得积分
                  </Button>
                </Link>
              </Empty>
            ),
          }}
        />
      </PageContainer>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(Recommend);
