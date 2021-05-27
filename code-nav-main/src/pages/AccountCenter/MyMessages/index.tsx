import { Badge, Button, List, message, Popconfirm, Tag } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import { CurrentUser } from '@/models/user';
import { ConnectState } from '@/models/connect';
import { MessageType } from '@/models/message';
import { LightFilter, ProFormSelect } from '@ant-design/pro-form';
import {
  deleteMessage,
  MessageSearchParams,
  readMessage,
  searchMessages,
} from '@/services/message';
import { MESSAGE_STATUS_ENUM, MESSAGE_STATUS_MAP, MESSAGE_TYPE_MAP } from '@/constant/message';
import { FilterOutlined } from '@ant-design/icons';
import './style.less';

interface MyMessagesProps {
  currentUser: CurrentUser;
}

interface MyMessagesState {
  list: MessageType[];
  total: number;
  searchParams: MessageSearchParams;
  loading: boolean;
  deleteLoading: { [key: string]: boolean };
}

const PAGE_SIZE = 8;

class MyMessages extends Component<MyMessagesProps, MyMessagesState> {
  state: MyMessagesState = {
    list: [],
    total: 0,
    searchParams: {
      status: MESSAGE_STATUS_ENUM.UNREAD,
      pageNum: 1,
      pageSize: PAGE_SIZE,
    },
    loading: true,
    deleteLoading: {},
  };

  componentDidMount() {
    const { searchParams } = this.state;
    this.doSearch(searchParams);
  }

  /**
   * 加载
   */
  doSearch(searchParams: MessageSearchParams) {
    const { currentUser } = this.props;

    if (currentUser._id) {
      this.setState({
        loading: true,
      });
      searchMessages(searchParams)
        .then((res) => {
          console.log(res);
          this.setState({
            total: res.total,
            list: res.data,
          });
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    }
  }

  /**
   * 阅读消息
   * @param item
   * @param index
   */
  async doReadMessage(item: MessageType, index: number) {
    const { _id, status } = item;
    if (status !== MESSAGE_STATUS_ENUM.UNREAD) {
      return;
    }
    const { list } = this.state;
    list[index].status = MESSAGE_STATUS_ENUM.HAS_READ;
    this.setState({
      list,
    });
    await readMessage(_id);
  }

  /**
   * 删除消息
   * @param messageId
   * @param idx
   */
  async doDeleteMessage(messageId: string, idx: number) {
    this.setState({
      deleteLoading: { [messageId]: true },
    });
    const res = await deleteMessage(messageId);
    const newList = this.state.list;
    if (res) {
      message.success('操作成功');
      newList.splice(idx, 1);
      this.setState({
        list: newList,
      });
    } else {
      message.error('操作失败，请重试');
    }
    this.setState({
      deleteLoading: { [messageId]: false },
    });
  }

  render() {
    const { list, loading, total, searchParams, deleteLoading } = this.state;

    return (
      <div className="my-messages">
        <LightFilter
          bordered
          collapseLabel={<FilterOutlined />}
          initialValues={{
            status: MESSAGE_STATUS_ENUM.UNREAD.toString(),
          }}
          onFinish={async (values) => {
            if (values.status) {
              // eslint-disable-next-line radix
              values.status = parseInt(values.status);
            }
            if (values.type) {
              // eslint-disable-next-line radix
              values.type = parseInt(values.type);
            }
            const params = {
              ...searchParams,
              ...values,
            };
            this.setState({
              searchParams: params,
            });
            this.doSearch(params);
          }}
        >
          <ProFormSelect name="type" placeholder="消息类型" valueEnum={MESSAGE_TYPE_MAP} />
          <ProFormSelect name="status" placeholder="消息状态" valueEnum={MESSAGE_STATUS_MAP} />
        </LightFilter>
        <div style={{ marginTop: 16 }} />
        <List<MessageType>
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item, index) => {
            const actions = [];

            actions.push(
              <Popconfirm
                title="确定删除该条消息么？"
                onConfirm={() => this.doDeleteMessage(item._id, index)}
                okText="确认"
                cancelText="取消"
              >
                <Button danger type="text" loading={deleteLoading[item._id]}>
                  删除
                </Button>
              </Popconfirm>,
            );

            return (
              <List.Item
                actions={actions}
                className="message-list-item"
                onClick={() => this.doReadMessage(item, index)}
              >
                <List.Item.Meta
                  title={
                    <>
                      {item.status === MESSAGE_STATUS_ENUM.UNREAD && <Badge color="red" />}
                      <Tag color="green">{MESSAGE_TYPE_MAP[item.type ?? 0]}</Tag> {item.title}
                    </>
                  }
                  description={item.content}
                />
              </List.Item>
            );
          }}
          pagination={{
            pageSize: searchParams.pageSize ?? PAGE_SIZE,
            current: searchParams.pageNum ?? 1,
            showSizeChanger: false,
            total,
            onChange: (pageNum, pageSize) => {
              const params = {
                ...searchParams,
                pageSize,
                pageNum,
              };
              this.setState({
                searchParams: params,
              });
              this.doSearch(params);
            },
          }}
        />
      </div>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(MyMessages);
