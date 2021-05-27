import {Button, Empty, List} from 'antd';
import React, {Component} from 'react';
import {connect, Link} from 'umi';
import {ResourceType} from "@/models/resource";
import ResourceCard from "@/components/ResourceCard";
import {CurrentUser} from "@/models/user";
import {ConnectState} from "@/models/connect";
import {getUserLikeResourcesByPage} from "@/services/user";

interface MyLikeResourcesProps {
  currentUser?: CurrentUser;
}

interface MyLikeResourcesState {
  resources?: ResourceType[];
  total: number;
  loading: boolean;
}

const listGrid = {
  gutter: 16,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 2,
  xxl: 3
};

const pageSize = 6;

class MyLikeResources extends Component<MyLikeResourcesProps, MyLikeResourcesState> {

  state: MyLikeResourcesState = {
    resources: [],
    total: 0,
    loading: true,
  };

  componentDidMount() {
    this.loadMyLikeResources(1);
  }

  /**
   * 加载我收藏的资源
   */
  loadMyLikeResources(pageNum: number) {
    const {currentUser} = this.props;

    if (currentUser && currentUser._id) {
      this.setState({
        loading: true,
      })
      getUserLikeResourcesByPage(currentUser._id, pageSize, pageNum).then(res => {
        this.setState({
          total: res.total,
          resources: res.data,
        });
      }).finally(() => {
        this.setState({
          loading: false,
        })
      })
    }
  }

  render() {
    const {resources, loading, total} = this.state;

    return (
      <div>
        <List<ResourceType>
          rowKey="id"
          grid={listGrid}
          loading={loading}
          pagination={{
            showSizeChanger: false,
            pageSize,
            total,
            onChange: (pageNum) => {
              this.loadMyLikeResources(pageNum);
            }
          }}
          dataSource={resources}
          renderItem={(item) => {
            return (
              <List.Item key={item._id}>
                <ResourceCard resource={item} />
              </List.Item>
            );
          }}
          locale={{
            emptyText: <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='您还没有收藏的资源哦'
            >
              <Link to='/recommend'><Button type='primary' size='large'>发现资源</Button></Link>
            </Empty>,
          }}
        />
      </div>
    );
  }
}

export default connect(({user}: ConnectState) => ({
  currentUser: user.currentUser,
}))(MyLikeResources);
