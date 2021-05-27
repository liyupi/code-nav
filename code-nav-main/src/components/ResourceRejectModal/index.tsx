import { AutoComplete, message, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { reviewResource } from '@/services/resource';
import reviewStatusEnum from '@/constant/reviewStatusEnum';

interface ReportModalProps {
  resourceId: string;
  visible: boolean;
  currentUser: CurrentUser;
  onClose: () => void;
  currentAuthority: string;
}

/**
 * 资源拒绝模态框
 * @param props
 * @constructor
 */
const ResourceRejectModal: FC<ReportModalProps> = (props) => {
  const { visible, currentUser, onClose, resourceId, currentAuthority = 'guest' } = props;

  const [reviewMessage, setReviewMessage] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const doSubmit = async () => {
    // 仅管理员可操作
    if (!currentUser._id  && !currentAuthority.includes('admin')) {
      message.error('请先登录');
      return;
    }
    if (!resourceId) {
      return;
    }
    // 执行操作
    setSubmitting(true);
    const res = await reviewResource(resourceId, reviewStatusEnum.REJECT, reviewMessage);
    if (res) {
      message.success('已下架');
      onClose();
    } else {
      message.error('操作失败');
    }
    setSubmitting(false);
  }

  return (
    <Modal
      title="请输入拒绝原因"
      visible={visible}
      confirmLoading={submitting}
      onOk={doSubmit}
      onCancel={onClose}
    >
      <AutoComplete
        options={[
          { value: '已有相同资源' },
          { value: '链接失效或非法' },
          { value: '描述不符' },
          { value: '资源标签不正确' },
          { value: '涉嫌引流，请联系微信 code_nav' },
        ]}
        style={{ width: '100%' }}
        placeholder="请输入拒绝原因"
        value={reviewMessage}
        onChange={(data) => setReviewMessage(data)}
      />
    </Modal>
  );
};

export default connect(({ user, login }: ConnectState) => ({
  currentUser: user.currentUser,
  currentAuthority: login.currentAuthority,

}))(ResourceRejectModal);
