import React, { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { Avatar, Button, Card, Form, List, message, Tag, Tooltip } from 'antd';
import { ProFormText, QueryFilter } from '@ant-design/pro-form';
import SelectTags from '@/components/SelectTags';
import { TagType, WholeTagsMap } from '@/models/tag';
import {EditOutlined, LikeFilled, LikeOutlined, MessageOutlined} from '@ant-design/icons';
import { UserIntroduceUserType } from '@/models/userIntroduce';
import {
  searchUserIntroduces,
  thumbUpUserIntroduce,
  UserIntroduceSearchParams,
} from '@/services/userIntroduce';
import MyFriendModal from '@/pages/Friend/MyFriendModal';
import reviewStatusEnum from '@/constant/reviewStatusEnum';
import copy from 'copy-to-clipboard';
import moment from 'moment';

interface FriendProps {
  currentUser?: CurrentUser;
  wholeTagsMap: WholeTagsMap;
}

const DEFAULT_PAGE_SIZE = 8;

const Friend: FC<FriendProps> = (props) => {
  const { wholeTagsMap } = props;
  const [list, setList] = useState<UserIntroduceUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<UserIntroduceSearchParams>({
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [total, setTotal] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    const res = await searchUserIntroduces({
      reviewStatus: reviewStatusEnum.PASS,
      ...searchParams,
    });
    if (res) {
      setList(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const pageContentView = (
    <div>
      <p>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        介绍自己，认识更多学编程的朋友，首次填写积分 +5 💰
      </p>
      <Button type="primary" icon={<EditOutlined />} onClick={() => setModalVisible(true)}>
        填写我的介绍
      </Button>
    </div>
  );

  const doThumbUp = async (id: string, index: number) => {
    // 禁止重复点赞
    if (list[index].isThumb) {
      message.error('您已经点过赞啦！');
      return;
    }
    const res = await thumbUpUserIntroduce(id);
    if (res) {
      message.success('点赞成功');
      const newList = [...list];
      newList[index].isThumb = true;
      newList[index].thumbNum = list[index].thumbNum + 1;
      setList(newList);
    } else {
      message.error('操作失败，请刷新重试');
    }
  };

  const itemTagsView = (tags: TagType[]) => {
    return tags.map((tag) => <Tag key={tag}>{tag}</Tag>);
  };

  return (
    <PageContainer title="找伙伴" content={pageContentView}>
      <Card style={{ marginBottom: 24 }}>
        <QueryFilter
          labelAlign="left"
          labelWidth="auto"
          defaultCollapsed={false}
          onFinish={async (values) => {
            setSearchParams(values);
          }}
        >
          <ProFormText name="content" label="内容" />
          <Form.Item label="标签" name="tags">
            <SelectTags
              allTags={wholeTagsMap.allTags}
              groupTags={wholeTagsMap.userIntroduceGroupTags}
            />
          </Form.Item>
        </QueryFilter>
      </Card>
      <Card>
        <List<UserIntroduceUserType>
          loading={loading}
          dataSource={list}
          itemLayout="vertical"
          renderItem={(item, index) => (
            <List.Item
              key={item._id}
              actions={[
                <Button
                  icon={item.isThumb ? <LikeFilled /> : <LikeOutlined />}
                  size="small"
                  type="text"
                  onClick={() => doThumbUp(item._id, index)}
                >
                  {' '}
                  {item.thumbNum}
                </Button>,
                <Tooltip title={`点击复制：${item.contact}`}>
                  <Button
                    icon={<MessageOutlined />}
                    size="small"
                    type="text"
                    onClick={() => {
                      copy(item.contact);
                      message.success('复制成功，快去联系小伙伴吧！');
                    }}
                  >
                    交流
                  </Button>
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.userInfo[0].avatarUrl} size="large" />}
                title={item.userInfo[0].nickName}
                description={item.content}
              />
              <div>
                <p>{itemTagsView(item.tags)}</p>
                <p style={{ fontSize: 12, color: '#aaa' }}>
                  发布时间：{moment(item._createTime).fromNow()}
                </p>
              </div>
            </List.Item>
          )}
          pagination={{
            pageSize: searchParams.pageSize ?? DEFAULT_PAGE_SIZE,
            current: searchParams.pageNum ?? 1,
            showSizeChanger: false,
            style: {
              marginBottom: 24,
            },
            total,
            onChange: (pageNum, pageSize) => {
              const params = {
                ...searchParams,
                pageSize,
                pageNum,
              };
              setSearchParams(params);
            },
          }}
        />
      </Card>
      <MyFriendModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        reload={loadData}
      />
    </PageContainer>
  );
};

export default connect(({ user, tag }: ConnectState) => ({
  currentUser: user.currentUser,
  wholeTagsMap: tag.wholeTagsMap,
}))(Friend);

