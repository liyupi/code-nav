import { Button, Col, Form, Input, message, Modal, Radio, Row } from 'antd';
import type { FC} from 'react';
import React, { useState } from 'react';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import { addReport } from '@/services/report';
import type { ReportType } from '@/models/report';
import reportReasonEnum, { REPORT_REASON_OPTIONS } from '@/constant/reportReasonEnum';
import type { CurrentUser } from '@/models/user';

const FormItem = Form.Item;
const { TextArea } = Input;

interface ReportModalProps {
  reportType: number;
  reportResourceId?: string;
  reportedUserId?: string;
  visible: boolean;
  currentUser: CurrentUser;
  onClose: () => void;
}

const formItemLayout = {
  labelCol: {
    xs: {
      span: 4,
    },
  },
};

const ReportModal: FC<ReportModalProps> = (props) => {
  const { visible, reportType, reportResourceId, reportedUserId, currentUser, onClose } = props;

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const doSubmit = async (values: ReportType) => {
    if (!currentUser._id) {
      message.error('请先登录！');
      return;
    }
    const { reportReason, reportDetail } = values;
    if (reportReason === reportReasonEnum.OTHERS && !reportDetail) {
      message.error('请填写举报详情');
      return;
    }
    setSubmitting(true);
    const report = {
      reportResourceId,
      reportedUserId,
      reportType,
      reportReason,
      reportDetail,
    };
    const res = await addReport(report);
    if (res) {
      message.success('举报成功，万分感谢！');
      onClose();
      form.resetFields();
    } else {
      message.error('操作失败');
    }
    setSubmitting(false);
  };

  return (
    <Modal title="我要举报" visible={visible} footer={null} onCancel={onClose}>
      <Form
        {...formItemLayout}
        form={form}
        name="report"
        labelAlign="left"
        initialValues={{
          reportReason: reportReasonEnum.CONTENT_EXPIRED,
        }}
        onFinish={doSubmit}
      >
        <FormItem label="原因" name="reportReason">
          <Radio.Group options={REPORT_REASON_OPTIONS} />
        </FormItem>
        <FormItem label="详情" name="reportDetail">
          <TextArea autoSize={{ minRows: 3, maxRows: 8 }} placeholder="请详细说明举报原因" />
        </FormItem>
        <FormItem>
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

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(ReportModal);
