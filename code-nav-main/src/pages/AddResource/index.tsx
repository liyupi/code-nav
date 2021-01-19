import {Button, Card, Input, Form, Select, Cascader, message, Modal, Row, Col, Tooltip, List} from 'antd';
import {connect, Dispatch, history} from 'umi';
import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import PicUploader from '../../components/PicUploader';
import TextArea from "antd/lib/input/TextArea";
import {ConnectState} from "@/models/connect";
import {TagType} from "@/models/tag";
import {FormType} from "@/models/form";
import {CascaderOptionType} from "antd/lib/cascader";
import {CurrentUser} from "@/models/user";
import {getById, search} from "@/services/resource";
import {CategoryType} from "@/models/category";
import {ResourceType} from "@/models/resource";
import ResourceCard from "@/components/ResourceCard";
import {URL_REG} from "@/utils/utils";
import {SearchOutlined} from "@ant-design/icons/lib";
import './style.less';

const FormItem = Form.Item;
const {Option} = Select;

interface AddResourceProps {
  submitting?: boolean;
  tagLoading?: boolean;
  formLoading?: boolean;
  categoryLoading?: boolean;
  dispatch: Dispatch;
  tags?: TagType[];
  categoryCascaderOptions?: CascaderOptionType[];
  forms?: FormType[];
  currentUser?: CurrentUser;
  keyCategoryMap: { [key: string]: CategoryType };
}

/**
 * 添加或修改资源
 * @param props
 * @constructor
 */
const AddResource: FC<AddResourceProps> = (props) => {

  const {submitting, tagLoading, formLoading, categoryCascaderOptions, currentUser = {} as CurrentUser, keyCategoryMap} = props;
  const [form] = Form.useForm();
  const resourceId = history.location.query['rid'];
  // 相似检测
  const [showSameNameModal, setShowSameNameModal] = useState<boolean>(false);
  const [showSimilarModal, setShowSimilarModal] = useState<boolean>(false);
  const [similarResources, setSimilarResources] = useState<ResourceType[]>([]);
  const [previewResource, setPreviewResource] = useState<ResourceType>();

  // 修改资源
  useEffect(() => {
    if (currentUser._id && resourceId && Object.keys(keyCategoryMap).length > 0) {
      getById(resourceId)?.then(res => {
        if (!res) {
          message.error('加载失败，请刷新重试');
          return;
        }
        if (res.userId !== currentUser._id) {
          message.error('只能修改自己的资源哦');
          return;
        }
        form.setFieldsValue(res);
      })
    }
  }, [resourceId, keyCategoryMap, currentUser])

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 5,
      },
      md: {
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
      md: {
        span: 12,
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
        offset: 5,
      },
      md: {
        span: 8,
        offset: 4,
      },
      lg: {
        span: 7,
        offset: 4,
      }
    },
  };

  const doSameCheck = () => {
    const name = form.getFieldValue('name');
    if (!name) {
      message.error('请先输入资源名称');
      return;
    }
    // 同名检测
    const searchParams = {
      name,
      pageSize: 5,
    };
    search(searchParams).then(res => {
      if (!res || res.length === 0) {
        message.success('未发现重复资源');
      } else {
        setSimilarResources(res);
        setShowSameNameModal(true);
      }
    })
  }

  const onFinish = (values: { [key: string]: any }) => {
    // 同名检测
    const searchParams = {
      name: values.name,
      pageSize: 5,
    };
    search(searchParams).then(res => {
      if (!res || res.length === 0) {
        doSubmit(values);
      } else {
        setSimilarResources(res);
        setShowSimilarModal(true);
      }
    })
  };

  const doSubmit = (values: { [key: string]: any }) => {
    if (!currentUser || !currentUser._id) {
      message.error('提交失败，请刷新页面重试！');
      return;
    }
    // 表单值特殊处理，多级分类只取最后一个
    values.category = values.category[values.category.length - 1];
    values.userId = currentUser._id;

    const {dispatch} = props;
    // 修改
    if (resourceId) {
      dispatch({
        type: 'resource/update',
        payload: {
          resourceId,
          resource: values,
          userId: currentUser._id,
        },
      });
      return;
    }
    // 新增
    dispatch({
      type: 'resource/add',
      payload: values,
    });
  }

  const onValuesChange = (changedValues: { [key: string]: any }, allValues: { [key: string]: any }) => {
    let previewResource = {...allValues} as ResourceType;
    if (allValues?.category) {
      previewResource.category = allValues.category[allValues.category.length - 1];
    }
    setPreviewResource(previewResource);
  };

  const handleSimilarModalOk = () => {
    setShowSimilarModal(false);
    doSubmit(form.getFieldsValue());
  }

  const handleSimilarModalCancel = () => {
    setShowSimilarModal(false);
  }

  const handleSameNameModalCancel = () => {
    setShowSameNameModal(false);
  }

  return (
    <PageContainer content="欢迎推荐优质编程资源，将获得积分奖励 💰">
      <Card bordered={false}>
        <Form
          style={{
            marginTop: 8,
          }}
          form={form}
          name="resource"
          {...formItemLayout}
          labelAlign='left'
          initialValues={{
            form: 'web',
          }}
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
            <Input placeholder="网站、文章等资源名，最多 25 字" maxLength={25} allowClear
                   addonAfter={
                     <Tooltip title="检测是否有重复资源" placement="topRight">
                       <SearchOutlined style={{fontSize: 16, cursor: 'pointer'}} onClick={doSameCheck} />
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
            label="分类"
            name="category"
            rules={[
              {
                required: true,
                message: '请选择分类',
              },
            ]}
          >
            <Cascader
              showSearch
              options={categoryCascaderOptions}
              expandTrigger="hover"
              allowClear
            />
          </FormItem>
          <FormItem
            label="形态"
            name="form"
            rules={[
              {
                required: true,
                message: '请选择形态',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="选择形态"
              loading={formLoading}
              optionFilterProp='children'
              allowClear
            >
              <Option value="web">网页</Option>
            </Select>
          </FormItem>
          <FormItem
            label="标签"
            name="tags"
            rules={[
              {
                max: 5,
                type: 'array',
                message: '至多选择 5 个标签',
              },
            ]}
          >
            <Select
              mode='tags'
              showSearch
              placeholder="可选择至多 5 个标签，支持新建"
              loading={tagLoading}
              optionFilterProp='children'
              tokenSeparators={[',']}
              allowClear
            >
              <Option value="前端">前端</Option>
            </Select>
          </FormItem>
          <FormItem
            label="图标"
            name="icon"
            tooltip={{title: '正方形图标展示效果最佳', placement: 'topLeft'}}
          >
            <PicUploader />
          </FormItem>
          <FormItem
            label="详情"
            name="detail"
          >
            <TextArea placeholder="详细介绍该资源的作用、用法等" autoSize={{minRows: 3, maxRows: 6}} />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Button type="primary" htmlType="submit" block loading={submitting} disabled={submitting}>
                  {submitting ? '提交中' : '提交'}
                </Button>
              </Col>
              <Col span={8}>
                <Tooltip placement="topRight" overlayStyle={{minWidth: 260}} title={
                  <ResourceCard resource={previewResource} loading={!previewResource} showActions={false} />
                }>
                  <Button>预览</Button>
                </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Card>
      <Modal title="已有相似资源" visible={showSameNameModal} footer={null} onCancel={handleSameNameModalCancel}>
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
      <Modal title="已有相似资源，是否确认提交" cancelText="我再想想" visible={showSimilarModal}
             onOk={handleSimilarModalOk} onCancel={handleSimilarModalCancel}>
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
    </PageContainer>
  );
};

export default connect(({loading, user}: ConnectState) => ({
  submitting: loading.effects['resource/add'] || loading.effects['resource/update'],
  tagLoading: loading.models.tags,
  formLoading: loading.models.forms,
  categoryLoading: loading.models.categories,
  currentUser: user.currentUser,
}))(AddResource);
