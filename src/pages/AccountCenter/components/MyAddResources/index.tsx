import {Button, Empty, List} from 'antd';
import React, {Component} from 'react';
import {connect, Link} from 'umi';
import {ResourceType} from "@/models/resource";
import ResourceCard from "@/components/ResourceCard";
import {searchByPage} from "@/services/resource";
import {CurrentUser} from "@/models/user";
import {ConnectState} from "@/models/connect";

interface MyAddResourcesProps {
  currentUser?: CurrentUser;
}

interface MyAddResourcesState {
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

class MyAddResources extends Component<MyAddResourcesProps, MyAddResourcesState> {

  state: MyAddResourcesState = {
    resources: [],
    total: 0,
    loading: true,
  };

  componentDidMount() {
    this.loadMyAddResources(1);
  }

  /**
   * 加载我推荐的资源
   */
  loadMyAddResources(pageNum: number) {
    const {currentUser} = this.props;

    if (currentUser && currentUser._id) {
      this.setState({
        loading: true,
      })
      searchByPage({
        userId: currentUser._id,
        pageNum,
        pageSize,
      }).then((res) => {
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
              this.loadMyAddResources(pageNum);
            }
          }}
          dataSource={resources}
          renderItem={(item) => {
            return (
              <List.Item key={item._id}>
                <ResourceCard resource={item} showReview showEdit />
              </List.Item>
            );
          }}
          locale={{
            emptyText: <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='您还没有推荐过资源哦'
            >
              <Link to='/addResource'>
                <Button type="primary" size='large'>推荐资源得积分</Button>
              </Link>
            </Empty>,
          }}
        />
      </div>
    );
  }
}

export default connect(({user}: ConnectState) => ({
  currentUser: user.currentUser,
}))(MyAddResources);
