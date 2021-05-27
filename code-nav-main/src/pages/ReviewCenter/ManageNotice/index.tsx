import { Button, Card, Col, Form, Input, List, message, Popconfirm, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser, Dispatch } from '@@/plugin-dva/connect';
import { NoAuth } from '@/components/NoAuth';
import { addNotice, deleteNotice, searchNoticesByPage } from '@/services/notice';
import type { NoticeType } from '@/models/notice';
import { PageContainer } from '@ant-design/pro-layout';
import { formatDateTimeStr } from '@/utils/utils';

const FormItem = Form.Item;

interface ReviewCenterProps {
  currentUser: CurrentUser;
  currentAuthority: string;
  dispatch: Dispatch;
}

const DEFAULT_PAGE_SIZE = 8;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
      offset: 6,
    },
  },
};

/**
 * 公告管理
 * @param props
 * @constructor
 */
const ManageNotice: React.FC<ReviewCenterProps> = (props) => {
  const { currentUser, currentAuthority = 'guest' } = props;
  const [searchParams, setSearchParams] = useState<any>({});
  const [deleteLoading, setDeleteLoading] = useState<any>({});
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<NoticeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    searchNoticesByPage({
      pageSize: DEFAULT_PAGE_SIZE,
      ...searchParams,
    })
      .then((res) => {
        setList(res.data);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const doSubmit = async (values: Record<string, any>) => {
    const userId = currentUser._id;
    if (!userId) {
      message.error('提交失败，请刷新页面重试！');
      return;
    }
    setSubmitting(true);
    const res = await addNotice(values as NoticeType);
    if (res) {
      message.success('操作成功');
      loadData();
      form.resetFields();
    } else {
      message.error('操作失败');
    }
    setSubmitting(false);
  };

  const onFinish = (values: Record<string, any>) => {
    doSubmit(values);
  };

  /**
   * 删除
   * @param id
   * @param idx
   */
  const doDelete = async (id: string, idx: number) => {
    setDeleteLoading({ [id]: true });
    const res = await deleteNotice(id);
    if (res) {
      message.success('操作成功');
      list.splice(idx, 1);
      setList(list);
    } else {
      message.error('操作失败，请重试');
    }
    setDeleteLoading({ [id]: false });
  };

  return currentUser._id && currentAuthority.includes('admin') ? (
    <PageContainer title="公告管理">
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col md={8} xs={24} style={{ marginBottom: 24 }}>
          <Card title="添加公告">
            <Form
              form={form}
              name="notice"
              {...formItemLayout}
              labelAlign="left"
              scrollToFirstError
              onFinish={onFinish}
            >
              <FormItem
                label="标题"
                name="title"
                rules={[
                  {
                    required: true,
                    message: '请输入资源名',
                  },
                ]}
              >
                <Input maxLength={60} allowClear />
              </FormItem>
              <FormItem label="内容" name="content">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
              </FormItem>
              <FormItem
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              >
                <Button type="primary" htmlType="submit" block loading={submitting}>
                  {submitting ? '操作中' : '提交'}
                </Button>
              </FormItem>
            </Form>
          </Card>
        </Col>
        <Col md={16} xs={24}>
          <Card title="公告列表">
            <List<NoticeType>
              rowKey="_id"
              itemLayout="vertical"
              loading={loading}
              dataSource={list}
              pagination={{
                pageSize: DEFAULT_PAGE_SIZE,
                current: searchParams.pageNum ?? 1,
                showSizeChanger: false,
                total,
                showTotal() {
                  return `总数 ${total}`;
                },
                onChange(pageNum) {
                  const params = {
                    ...searchParams,
                    pageNum,
                  };
                  setSearchParams(params);
                },
              }}
              renderItem={(item, index) => {
                return (
                  <List.Item
                    key={item._id}
                    extra={
                      <Popconfirm
                        title="确定删除么？"
                        onConfirm={() => doDelete(item._id, index)}
                        okText="确认"
                        cancelText="取消"
                      >
                        <Button danger type="text" loading={deleteLoading[item._id]}>
                          删除
                        </Button>
                      </Popconfirm>
                    }
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={formatDateTimeStr(item._createTime)}
                    />
                    {item.content}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  ) : (
    <NoAuth />
  );
};

export default connect(({ user, login }: ConnectState) => ({
  currentUser: user.currentUser,
  currentAuthority: login.currentAuthority,
}))(ManageNotice);
