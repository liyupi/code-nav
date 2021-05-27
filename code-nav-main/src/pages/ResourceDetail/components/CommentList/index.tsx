import {
  Avatar,
  Button,
  Comment,
  Form,
  Input,
  List,
  message,
  Modal,
  Rate,
  Space,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import type { ResourceType } from '@/models/resource';
import moment from 'moment';
import { addComment, searchComments, thumbUpComment } from '@/services/comment';
import type { CommentType, CommentUserType } from '@/models/comment';
import { connect, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import reviewStatusEnum from '@/constant/reviewStatusEnum';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import styles from './index.less';

interface CommentListProps {
  resource: ResourceType;
  currentUser?: CurrentUser;
}

const rateTips = ['毫无用处', '用处不大', '还行', '不错', '太棒了'];
const DEFAULT_PAGE_SIZE = 8;
const DEFAULT_RATE = 4;

/**
 * 相似资源
 * @param props
 * @constructor
 */
const CommentList: React.FC<CommentListProps> = (props) => {
  const { resource, currentUser = {} } = props;

  const [list, setList] = useState<CommentUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [rateModalOpen, setRateModalOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const loadData = async () => {
    if (resource && resource._id) {
      setLoading(true);
      const res = await searchComments({
        resourceId: resource._id,
        reviewStatus: reviewStatusEnum.PASS,
        pageSize: DEFAULT_PAGE_SIZE,
        pageNum,
      });
      if (res) {
        setList(res.data);
        setTotal(res.total);
      } else {
        message.error('加载失败，请刷新重试');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [resource, pageNum]);

  const handleSubmit = () => {
    if (!content) {
      message.error('请输入评论内容');
      return;
    }
    setRateModalOpen(true);
  };

  const doSubmit = async () => {
    if (!currentUser._id) {
      message.error('请先登录');
      return;
    }
    setSubmitting(true);
    const res = await addComment({
      rate,
      content,
      resourceId: resource._id,
      userId: currentUser._id,
    } as CommentType);
    if (res) {
      message.success('感谢评论！审核通过后显示');
      setContent('');
      setRate(DEFAULT_RATE);
      setRateModalOpen(false);
    } else {
      message.error('评论失败，请重试！');
    }
    setSubmitting(false);
  };

  const doThumbUp = async (id: string, index: number) => {
    // 禁止重复点赞
    if (list[index].isThumb) {
      message.error('您已经点过赞啦！');
      return;
    }
    const res = await thumbUpComment(id);
    if (res) {
      message.success('点赞成功');
      const newList = [...list];
      newList[index].isThumb = true;
      newList[index].thumbNum = (list[index].thumbNum ?? 0) + 1;
      setList(newList);
    } else {
      message.error('操作失败，请刷新重试');
    }
  };

  return (
    <div>
      <Modal
        title="请给资源打分"
        visible={rateModalOpen}
        onCancel={() => setRateModalOpen(false)}
        footer={
          <Button type="primary" onClick={doSubmit} disabled={submitting} loading={submitting}>
            提交
          </Button>
        }
      >
        <Rate
          tooltips={rateTips}
          allowClear={false}
          value={rate}
          onChange={(val) => setRate(val)}
        />
        <span style={{ marginLeft: 16 }}>{rateTips[rate - 1]}</span>
      </Modal>
      <List<CommentUserType>
        rowKey="_id"
        dataSource={list}
        split={false}
        loading={loading}
        pagination={{
          size: 'small',
          pageSize: DEFAULT_PAGE_SIZE,
          current: pageNum,
          showSizeChanger: false,
          hideOnSinglePage: true,
          total,
          onChange(newPageNum) {
            setPageNum(newPageNum);
          },
        }}
        renderItem={(item, index) => {
          return (
            <List.Item key={item._id}>
              <Comment
                actions={[
                  <span onClick={() => doThumbUp(item._id, index)}>
                    <Space>
                      {item.isThumb ? <LikeFilled /> : <LikeOutlined />}
                      {item.thumbNum ?? 0}
                    </Space>
                  </span>,
                ]}
                author={item.userInfo[0].nickName}
                avatar={<Avatar src={item.userInfo[0].avatarUrl} />}
                content={<p>{item.content}</p>}
                datetime={
                  <>
                    <Tooltip title={moment(item._createTime).format('YYYY-MM-DD HH:mm:ss')}>
                      <span>{moment(item._createTime).fromNow()}</span>
                    </Tooltip>
                    <Rate
                      allowHalf
                      disabled
                      className={styles.rank}
                      count={item.rate}
                      defaultValue={item.rate}
                    />
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
      {currentUser._id ? (
        <Comment
          avatar={<Avatar src={currentUser.avatarUrl} alt={currentUser.nickName} />}
          content={
            <>
              <Form.Item>
                <Input.TextArea
                  rows={3}
                  maxLength={120}
                  autoSize={{ minRows: 3, maxRows: 8 }}
                  placeholder="请输入评论"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  loading={submitting}
                  onClick={handleSubmit}
                  type="primary"
                >
                  评论
                </Button>
              </Form.Item>
            </>
          }
        />
      ) : (
        <Button type="primary" size="large" style={{width: '100%'}}>
          <Link to="/user/login">点击登录后发表评论</Link>
        </Button>
      )}
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(CommentList);
