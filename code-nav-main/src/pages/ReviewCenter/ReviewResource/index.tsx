import {Avatar, Button, Card, Col, Form, Input, List, message, Modal, Row, Tooltip,} from 'antd';
import React, {useEffect, useState} from 'react';
import type {ResourceType} from '@/models/resource';
import {
  getResource,
  reviewResource,
  searchResources,
  searchResourcesByPage,
  updateResource,
} from '@/services/resource';
import {connect} from 'umi';
import type {ConnectState} from '@/models/connect';
import type {CurrentUser, Dispatch, SimpleUser, WholeTagsMap} from '@@/plugin-dva/connect';
import reviewStatusEnum, {REVIEW_STATUS_MAP, reviewStatusInfoMap,} from '@/constant/reviewStatusEnum';
import {NoAuth} from '@/components/NoAuth';
import {ProFormSelect, ProFormText, QueryFilter} from '@ant-design/pro-form';
import moment from 'moment';
import {formatDateTimeStr, URL_REG} from '@/utils/utils';
import PicUploader from '@/components/PicUploader';
import ResourceCard from '@/components/ResourceCard';
import {getUserSimpleInfo} from '@/services/user';
import {SearchOutlined} from '@ant-design/icons/lib';
import SelectTags from '@/components/SelectTags';
import ResourceRejectModal from "@/components/ResourceRejectModal";

const FormItem = Form.Item;

interface ReviewCenterProps {
  currentUser: CurrentUser;
  currentAuthority: string;
  dispatch: Dispatch;
  wholeTagsMap: WholeTagsMap;
}

const DEFAULT_PAGE_SIZE = 8;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

/**
 * 审核资源
 * @param props
 * @constructor
 */
const ReviewResource: React.FC<ReviewCenterProps> = (props) => {
  const {currentUser, currentAuthority = 'guest', wholeTagsMap} = props;
  const [searchParams, setSearchParams] = useState<any>({
    reviewStatus: reviewStatusEnum.REVIEWING,
  });
  const [total, setTotal] = useState<number>(0);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [user, setUser] = useState<SimpleUser>({});
  const [resourceId, setResourceId] = useState<string>('');
  const [previewResource, setPreviewResource] = useState<Partial<ResourceType>>({});
  // 相似检测
  const [showSameNameModal, setShowSameNameModal] = useState<boolean>(false);
  const [similarResources, setSimilarResources] = useState<ResourceType[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    searchResourcesByPage({
      pageSize: DEFAULT_PAGE_SIZE,
      orderKey: '_createTime',
      ...searchParams,
    })
      .then((res) => {
        setResources(res.data);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  // 需要修改资源
  useEffect(() => {
    if (currentUser._id && resourceId) {
      form.resetFields();
      getResource(resourceId).then((res) => {
        if (!res) {
          message.error('加载失败，请刷新重试');
          return;
        }
        getUserSimpleInfo(res.userId)?.then((tmpUser) => {
          setUser(tmpUser);
        });
        setPreviewResource(res);
        form.setFieldsValue(res);
      });
    }
  }, [resourceId, currentUser]);

  const doSameCheck = () => {
    const name = form.getFieldValue('name');
    if (!name) {
      message.error('请先输入资源名称');
      return;
    }
    // 同名检测
    const params = {
      reviewStatus: reviewStatusEnum.PASS,
      name,
      pageSize: 5,
    };
    searchResources(params).then((res) => {
      if (!res || res.length === 0) {
        message.success('未发现重复资源');
      } else {
        setSimilarResources(res);
        setShowSameNameModal(true);
      }
    });
  };

  const doSubmit = (values: Record<string, any>) => {
    if (!currentUser._id) {
      message.error('提交失败，请刷新页面重试！');
      return;
    }
    if (!resourceId) {
      return;
    }
    setSubmitting(true);
    const res = updateResource(resourceId, values);
    if (res) {
      message.success('更新成功');
    } else {
      message.error('更新失败');
    }
    setSubmitting(false);
  };

  const onFinish = (values: Record<string, any>) => {
    doSubmit(values);
  };

  const onValuesChange = (
    changedValues: Record<string, any>,
    allValues: Record<string, any>,
  ) => {
    const tmpResource = {...allValues} as ResourceType;
    setPreviewResource({...previewResource, ...tmpResource});
  };

  const doPassReview = () => {
    if (!currentUser._id) {
      message.error('请先登录');
      return;
    }
    setSubmitting(true);
    reviewResource(resourceId, reviewStatusEnum.PASS)
      .then((res) => {
        if (res) {
          message.success('已通过');
        } else {
          message.error('操作失败');
        }
      })
      .finally(() => setSubmitting(false));
  };

  const doRejectReview = () => {
    setShowRejectModal(true);
  };

  const handleSameNameModalCancel = () => {
    setShowSameNameModal(false);
  };

  return currentUser._id && currentAuthority.includes('admin') ? (
    <>
      <Card>
        <QueryFilter
          collapsed={false}
          initialValues={{
            reviewStatus: reviewStatusEnum.REVIEWING.toString(),
          }}
          onFinish={async (values) => {
            if (values.reviewStatus) {
              // eslint-disable-next-line radix
              values.reviewStatus = parseInt(values.reviewStatus);
            }
            setSearchParams(values);
          }}
        >
          <ProFormText name="name" label="资源名" />
          <ProFormSelect name="reviewStatus" label="审核状态" valueEnum={REVIEW_STATUS_MAP} />
        </QueryFilter>
      </Card>
      <Row gutter={24} style={{marginTop: 24}}>
        <Col md={6} xs={24} style={{marginBottom: 24}}>
          <Card>
            <List<ResourceType>
              rowKey="_id"
              loading={loading}
              dataSource={resources}
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
              renderItem={(item) => {
                const reviewStatusInfo = reviewStatusInfoMap[item.reviewStatus];
                return (
                  <List.Item key={item._id}>
                    <List.Item.Meta
                      title={
                        <a
                          style={{color: reviewStatusInfo.color}}
                          onClick={() => setResourceId(item._id)}
                        >
                          {item.name}
                        </a>
                      }
                      description={moment(item._createTime).fromNow()}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col md={18} xs={24}>
          <Card>
            <Form
              style={{
                marginTop: 8,
              }}
              form={form}
              name="resource"
              {...formItemLayout}
              labelAlign="left"
              scrollToFirstError
              onFinish={onFinish}
              onValuesChange={onValuesChange}
            >
              <FormItem
                label="名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入资源名',
                  },
                ]}
              >
                <Input
                  placeholder="网站、文章等资源名，最多 25 字"
                  maxLength={60}
                  allowClear
                  addonAfter={
                    <Tooltip title="检测是否有重复资源" placement="topRight">
                      <SearchOutlined
                        style={{fontSize: 16, cursor: 'pointer'}}
                        onClick={doSameCheck}
                      />
                    </Tooltip>
                  }
                />
              </FormItem>
              <FormItem
                label="描述"
                name="desc"
                rules={[
                  {
                    required: true,
                    message: '请输入描述',
                  },
                ]}
              >
                <Input placeholder="用一句话简单介绍资源，最多 80 字" maxLength={80} allowClear />
              </FormItem>
              <FormItem
                label="链接"
                name="link"
                rules={[
                  {
                    required: true,
                    message: '请填写链接',
                  },
                  {
                    pattern: URL_REG,
                    message: '请填写合法链接',
                  },
                ]}
              >
                <Input placeholder="便于找到资源的网址，http(s) 开头" allowClear />
              </FormItem>
              <FormItem
                label="标签"
                name="tags"
                rules={[
                  {
                    required: true,
                    message: '至少填写 1 个标签',
                  },
                  {
                    max: 8,
                    type: 'array',
                    message: '至多选择 8 个标签',
                  },
                ]}
              >
                <SelectTags
                  allTags={wholeTagsMap.allTags}
                  groupTags={wholeTagsMap.groupTags}
                  maxTagsNumber={8}
                />
              </FormItem>
              <FormItem
                label="图标"
                name="icon"
                tooltip={{title: '正方形图标展示效果最佳', placement: 'topLeft'}}
              >
                <PicUploader />
              </FormItem>
              <FormItem label="详情" name="detail">
                <Input.TextArea
                  placeholder="详细介绍该资源的作用、用法等"
                  autoSize={{minRows: 3, maxRows: 6}}
                />
              </FormItem>
              <FormItem label="推荐人">
                <div>
                  <Avatar src={user?.avatarUrl} style={{marginRight: 5}} /> {user?.nickName}
                </div>
              </FormItem>
              <FormItem label="创建时间">{formatDateTimeStr(previewResource._createTime)}</FormItem>
              <FormItem label="修改时间">{formatDateTimeStr(previewResource._updateTime)}</FormItem>
              <FormItem label="审核时间">{formatDateTimeStr(previewResource.reviewTime)}</FormItem>
              <FormItem label="发布时间">{formatDateTimeStr(previewResource.publishTime)}</FormItem>
              <FormItem
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              >
                <Row gutter={24}>
                  <Col span={6}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      ghost
                      block
                      loading={submitting}
                      disabled={submitting || !resourceId}
                    >
                      {submitting ? '操作中' : '修改'}
                    </Button>
                  </Col>
                  <Col span={6}>
                    <Button
                      type="primary"
                      block
                      loading={submitting}
                      disabled={submitting || !resourceId}
                      onClick={doPassReview}
                    >
                      {submitting ? '操作中' : '通过'}
                    </Button>
                  </Col>
                  <Col span={6}>
                    <Button
                      type="primary"
                      danger
                      block
                      loading={submitting}
                      disabled={submitting || !resourceId}
                      onClick={doRejectReview}
                    >
                      {submitting ? '操作中' : '拒绝'}
                    </Button>
                  </Col>
                  <Col span={6}>
                    <Tooltip
                      placement="topRight"
                      overlayStyle={{minWidth: 260}}
                      title={
                        <ResourceCard
                          resource={previewResource}
                          loading={!previewResource}
                          showActions={false}
                        />
                      }
                    >
                      <Button>预览</Button>
                    </Tooltip>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
      <ResourceRejectModal
        visible={showRejectModal}
        resourceId={resourceId}
        onClose={() => setShowRejectModal(false)}
      />
      <Modal
        title="已有相似资源"
        visible={showSameNameModal}
        footer={null}
        onCancel={handleSameNameModalCancel}
      >
        <List<ResourceType>
          rowKey="_id"
          dataSource={similarResources}
          pagination={{
            pageSize: 1,
          }}
          split={false}
          renderItem={(item) => {
            return (
              <List.Item key={item._id}>
                <ResourceCard resource={item} showActions={false} />
              </List.Item>
            );
          }}
        />
      </Modal>
    </>
  ) : (
    <NoAuth />
  );
};

export default connect(({user, login, tag}: ConnectState) => ({
  currentUser: user.currentUser,
  currentAuthority: login.currentAuthority,
  wholeTagsMap: tag.wholeTagsMap,
}))(ReviewResource);
