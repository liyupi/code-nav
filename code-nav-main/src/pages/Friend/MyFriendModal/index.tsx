import { Button, Col, Form, Input, message, Modal, Row, Space } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { FC} from 'react';
import React, { useEffect, useState } from 'react';
import type { CurrentUser } from '@/models/user';
import type { WholeTagsMap } from '@/models/tag';
import SelectTags from '@/components/SelectTags';
import type { ConnectState } from '@/models/connect';
import { addOrUpdateUserIntroduce, getUserIntroduce } from '@/services/userIntroduce';
import type { UserIntroduceType } from '@/models/userIntroduce';
import { reviewStatusInfoMap } from '@/constant/reviewStatusEnum';
import './style.less';

const FormItem = Form.Item;

interface MyFriendModalProps {
  dispatch: Dispatch;
  wholeTagsMap: WholeTagsMap;
  currentUser: CurrentUser;
  visible: boolean;
  onClose: () => void;
  reload: () => void;
}

const formItemLayout = {
  labelCol: {
    xs: {
      span: 4,
    },
  },
};

/**
 * 添加或修改资源
 * @param props
 * @constructor
 */
const MyFriendModal: FC<MyFriendModalProps> = (props) => {
  const { wholeTagsMap, currentUser, visible, onClose, reload } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [userIntroduce, setUserIntroduce] = useState<UserIntroduceType>();

  const loadData = async () => {
    if (!currentUser._id) {
      return;
    }
    const data = await getUserIntroduce(currentUser._id);
    form.setFieldsValue(data);
    setUserIntroduce(data);
  };

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [currentUser, visible]);

  const doSubmit = async (values: UserIntroduceType) => {
    if (!currentUser._id) {
      message.error('提交失败，请刷新页面重试！');
      return;
    }
    setSubmitting(true);
    const res = await addOrUpdateUserIntroduce(values);
    if (res) {
      message.success('操作成功，审核通过后自动公开');
      form.resetFields();
      onClose();
      reload();
    } else {
      message.error('操作失败');
    }
    setSubmitting(false);
  };

  const titleView = (
    <Space>
      <span>自我介绍</span>
      {userIntroduce ? `(${reviewStatusInfoMap[userIntroduce.reviewStatus].text})` : ''}
    </Space>
  );

  return (
    <Modal title={titleView} visible={visible} footer={null} onCancel={() => onClose()}>
      <Form
        style={{
          marginTop: 8,
        }}
        {...formItemLayout}
        form={form}
        name="resource"
        labelAlign="left"
        scrollToFirstError
        onFinish={doSubmit}
      >
        <FormItem
          label="介绍"
          name="content"
          rules={[
            {
              required: true,
              message: '请填写介绍',
            },
          ]}
        >
          <Input.TextArea placeholder="认真介绍一下自己吧" autoSize={{ minRows: 3, maxRows: 6 }} />
        </FormItem>
        <FormItem label="标签" name="tags">
          <SelectTags
            allTags={wholeTagsMap.allTags}
            groupTags={wholeTagsMap.userIntroduceGroupTags}
            placeholder="帮你找到更合适的小伙伴"
            maxTagsNumber={5}
          />
        </FormItem>
        <FormItem label="联系方式" name="contact">
          <Input placeholder="微信等，填写后才公开介绍" maxLength={100} allowClear />
        </FormItem>
        <FormItem name="_id" hidden>
          <Input />
        </FormItem>
        <FormItem
          style={{
            marginTop: 32,
          }}
        >
          <Row gutter={24} justify="end">
            <Col>
              <Button
                htmlType="reset"
                block
                onClick={() => {
                  form.resetFields();
                  onClose();
                }}
              >
                取消
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? '提交中' : '提交'}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ loading, user, tag }: ConnectState) => ({
  submitting: loading.effects['resource/add'] || loading.effects['resource/update'],
  wholeTagsMap: tag.wholeTagsMap,
  currentUser: user.currentUser,
}))(MyFriendModal);
