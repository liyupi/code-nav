import {Button, Empty, List} from 'antd';
import React, {Component} from 'react';

import {PageContainer} from '@ant-design/pro-layout';
import {Link} from 'umi';
import ResourceCard from "@/components/ResourceCard";
import {ResourceType} from "@/models/resource";
import styles from './style.less';
import cardListStyles from '@/cardList.less';
import {listRecommend} from "@/services/resource";
import {connect} from "@@/plugin-dva/exports";
import {ConnectState} from "@/models/connect";
import {CurrentUser} from "@/models/user";

interface RecommendProps {
  currentUser?: CurrentUser;
}

interface RecommendState {
  resources: ResourceType[];
  initLoading: boolean;
  moreLoading: boolean;
  pageNum: number;
  hasMore: boolean;
}

class Recommend extends Component<RecommendProps, RecommendState> {

  state = {
    resources: [],
    initLoading: true,
    moreLoading: false,
    pageNum: 1,
    hasMore: true,
  }

  componentDidMount() {
    this.doLoadMore(true);
  }

  doLoadMore = async (firstLoad?: boolean) => {
    const {resources, pageNum} = this.state;
    if (firstLoad) {
      this.setState({
        initLoading: true,
      })
    } else {
      this.setState({
        moreLoading: true,
      })
    }
    let res = await listRecommend(pageNum, 12);
    this.setState({
      resources: [...resources, ...res],
      pageNum: pageNum + 1,
    })
    if (!res || res.length === 0) {
      this.setState({
        hasMore: false
      })
    }
    if (firstLoad) {
      this.setState({
        initLoading: false,
      })
    } else {
      this.setState({
        moreLoading: false
      })
    }
  }

  render() {
    const {
      resources,
      initLoading,
      moreLoading,
      hasMore,
      pageNum,
    } = this.state;

    const {currentUser = {} as CurrentUser} = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        发现编程世界的满天星辰 ✨
      </div>
    );

    const loadMore = !initLoading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 40,
          columnSpan: 'all',
        }}
      >
        {hasMore ? (
            pageNum > 1 && !currentUser._id ?
              <Button type="primary" size='large'><Link to="/user/login">点击登录 查看更多</Link></Button> :
              <Button type="primary" size='large' loading={moreLoading}
                      onClick={() => this.doLoadMore(false)}>加载更多</Button>
          ) :
          (
            resources.length > 0 &&
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无更多'>
              <Link to='/addResource'><Button type="primary" size='large'>推荐资源得积分</Button></Link>
            </Empty>
          )
        }
      </div>
    ) : null;

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="图片"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    return (
      <PageContainer content={content} extraContent={extraContent}>
        <div className={resources && resources.length > 0 ? cardListStyles.cardList : ''}>
          <List<ResourceType>
            rowKey="id"
            loading={initLoading}
            dataSource={resources}
            loadMore={loadMore}
            renderItem={(item) => {
              return (
                <List.Item key={item._id}>
                  <ResourceCard resource={item} loading={initLoading} />
                </List.Item>
              );
            }}
            locale={{
              emptyText: <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description='暂无资源'
              >
                <Link to='/addResource'><Button type="primary" size='large'>推荐资源得积分</Button></Link>
              </Empty>,
            }}
          />
        </div>
      </PageContainer>
    );
  }
}

export default connect(({user}: ConnectState) => ({
  currentUser: user.currentUser,
}))(Recommend);
