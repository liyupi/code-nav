import { AutoComplete, Divider, message, Modal, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CommentType } from '@/models/comment';
import type { CurrentUser } from '@@/plugin-dva/connect';
import reviewStatusEnum, { reviewStatusInfoMap } from '@/constant/reviewStatusEnum';
import { NoAuth } from '@/components/NoAuth';
import { reviewComment, searchComments } from '@/services/comment';

interface ReviewCenterProps {
  currentUser: CurrentUser;
  currentAuthority: string;
}

/**
 * 审核评论
 * @param props
 * @constructor
 */
const ReviewComment: React.FC<ReviewCenterProps> = (props) => {
  const { currentUser = {}, currentAuthority = 'guest' } = props;
  const actionRef = useRef<ActionType>();
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<string>();
  const [rejectCommentId, setRejectCommentId] = useState<string>('');

  const columns: ProColumns<CommentType>[] = [
    {
      title: '_id',
      dataIndex: '_id',
      copyable: true,
      ellipsis: true,
      width: 50,
    },
    {
      title: '内容',
      dataIndex: 'content',
      copyable: true,
      hideInForm: true,
    },
    {
      title: '评星',
      dataIndex: 'rate',
      width: 100,
    },
    {
      title: '用户',
      dataIndex: 'userId',
      copyable: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: '资源',
      dataIndex: 'resourceId',
      render: (text, record) => {
        const url = `../rd/?rid=${record.resourceId}`;
        return (
          <a href={url} target="_blank" rel="noreferrer">
            {text}
          </a>
        );
      },
      copyable: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: '_createTime',
      valueType: 'dateTime',
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      valueType: 'select',
      valueEnum: reviewStatusInfoMap,
      render: (_, record) => {
        return (
          <Tag color={reviewStatusInfoMap[record.reviewStatus].color}>
            {reviewStatusInfoMap[record.reviewStatus].text}
          </Tag>
        );
      },
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div key={record._id}>
          <a
            onClick={() => {
              if (!currentUser._id) {
                message.error('请先登录');
                return;
              }
              reviewComment(record._id, reviewStatusEnum.PASS).then((res) => {
                if (res) {
                  message.success('已通过');
                } else {
                  message.error('操作失败');
                }
              });
            }}
          >
            通过
          </a>
          <Divider type="vertical" />
          <a
            style={{ color: 'red' }}
            onClick={() => {
              setShowRejectModal(true);
              setRejectCommentId(record._id);
            }}
          >
            拒绝
          </a>
        </div>
      ),
    },
  ];

  return currentUser._id && currentAuthority.includes('admin') ? (
    <>
      <ProTable<CommentType>
        headerTitle="审核评论"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 100,
        }}
        request={(params) => {
          return searchComments({
            ...params,
            pageNum: params.current,
            reviewStatus: reviewStatusEnum.REVIEWING,
          }).then((res) => {
            return {
              data: res.data,
              success: true,
              total: res.total,
            };
          });
        }}
        columns={columns}
      />
      <Modal
        title="请输入拒绝原因"
        visible={showRejectModal}
        onOk={() => {
          if (!currentUser._id) {
            message.error('请先登录');
            return;
          }
          reviewComment(rejectCommentId, reviewStatusEnum.REJECT, reviewMessage).then((res) => {
            if (res) {
              message.success('已拒绝');
            } else {
              message.error('操作失败');
            }
            setShowRejectModal(false);
          });
        }}
        onCancel={() => setShowRejectModal(false)}
      >
        <AutoComplete
          options={[
            { value: '无意义的评论' },
            { value: '有广告行为' },
            { value: '不文明的用词' },
            { value: '评论不属实' },
          ]}
          style={{ width: '100%' }}
          placeholder="请输入拒绝原因"
          value={reviewMessage}
          onChange={(data) => setReviewMessage(data)}
        />
      </Modal>
    </>
  ) : (
    <NoAuth />
  );
};

export default connect(({ user, login }: ConnectState) => ({
  currentUser: user.currentUser,
  currentAuthority: login.currentAuthority,
}))(ReviewComment);
