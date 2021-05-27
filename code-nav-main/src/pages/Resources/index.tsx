import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Card, Empty, Form, List, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, history, Link } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { GroupTag, WholeTagsMap } from '@/models/tag';
import type { ResourceType } from '@/models/resource';
import ResourceCard from '@/components/ResourceCard';
import type { ResourceSearchParams } from '@/services/resource';
import { searchResourcesByPage } from '@/services/resource';
import reviewStatusEnum from '@/constant/reviewStatusEnum';
import { RiseOutlined, TagsOutlined } from '@ant-design/icons/lib';
import type { CurrentUser } from '@/models/user';
import { CATEGORY_MAP } from '@/constant/categoryMap';
import { PRE_PAGE_STATE } from '@/constant';
import { NoAuth } from '@/components/NoAuth';
import SelectTags from '@/components/SelectTags';
import './style.less';

interface ResourcesProps {
  match: any;
  location: {
    pathname: string;
    query: {
      q?: string;
    };
  };
  currentUser?: CurrentUser;
  wholeTagsMap: WholeTagsMap;
}

const listGrid = {
  gutter: 16,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3,
  xxl: 3,
};

const formItemLayout = {
  labelCol: {
    sm: {
      span: 4,
    },
    lg: {
      span: 3,
    },
    xl: {
      span: 2,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
  },
};

const PAGE_SIZE = 12;

const Resources: FC<ResourcesProps> = (props) => {
  const { match, currentUser = {} as CurrentUser, location, wholeTagsMap } = props;
  const { category } = match.params;

  let initSearchParams: ResourceSearchParams = {
    name: location.query.q ?? '',
    pageSize: PAGE_SIZE,
    pageNum: 1,
    tags: category ? [CATEGORY_MAP[category].mapTag] : [],
  };

  // 返回后恢复原搜索条件
  if (history.action === 'POP') {
    const jsonStr = localStorage.getItem(PRE_PAGE_STATE);
    if (jsonStr) {
      initSearchParams = JSON.parse(jsonStr);
      localStorage.removeItem(PRE_PAGE_STATE);
    }
  }

  const [searchParams, setSearchParams] = useState<ResourceSearchParams>(initSearchParams);
  const [total, setTotal] = useState<number>(0);
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const title = category ? CATEGORY_MAP[category].name : '资源大全';
  const [groupTags, setGroupTags] = useState<GroupTag[]>();

  const doSearch = (params: ResourceSearchParams) => {
    setResources([]);
    setLoading(true);
    searchResourcesByPage({ ...params, reviewStatus: reviewStatusEnum.PASS })
      .then((res) => {
        setResources(res.data);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    scrollTo({
      top: 0,
    });
    setSearchParams(initSearchParams);
    form.setFieldsValue(initSearchParams);
    doSearch(initSearchParams);
  }, [category, location.query.q]);

  useEffect(() => {
    if (category && wholeTagsMap.categoryTagsMap[category]) {
      setGroupTags([
        {
          name: '推荐',
          tags: wholeTagsMap.categoryTagsMap[category].tags,
        },
        ...wholeTagsMap.groupTags,
      ]);
    } else {
      setGroupTags(undefined);
    }
  }, [category, wholeTagsMap.categoryTagsMap]);

  const handleValuesChange = (changedValues: any) => {
    const params = { ...searchParams, ...changedValues, pageNum: 1 };
    setSearchParams(params);
    doSearch(params);
  };

  return currentUser._id ? (
    <PageContainer title={title}>
      <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
        <Form
          {...formItemLayout}
          form={form}
          onValuesChange={handleValuesChange}
          initialValues={{
            orderKey: '_createTime',
            ...searchParams,
          }}
          labelAlign="left"
        >
          <Form.Item
            label={
              <>
                <TagsOutlined /> <span style={{ marginLeft: 8 }}>筛选</span>
              </>
            }
            name="tags"
            labelAlign="left"
          >
            <SelectTags
              allTags={wholeTagsMap.allTags}
              groupTags={groupTags ?? wholeTagsMap.groupTags}
              maxTagsNumber={5}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <RiseOutlined /> <span style={{ marginLeft: 8 }}>排序</span>
              </>
            }
            name="orderKey"
          >
            <Radio.Group>
              <Radio.Button value="_createTime">时间</Radio.Button>
              <Radio.Button value="rate">评价</Radio.Button>
              <Radio.Button value="likeNum">收藏</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Card>
      <br />
      <List<ResourceType>
        rowKey="_id"
        loading={loading}
        dataSource={resources}
        grid={listGrid}
        pagination={{
          pageSize: searchParams.pageSize ?? PAGE_SIZE,
          current: searchParams.pageNum ?? 1,
          showSizeChanger: false,
          total,
          onChange(pageNum, pageSize) {
            const params = {
              ...searchParams,
              pageSize,
              pageNum,
            };
            setSearchParams(params);
            doSearch(params);
          },
        }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无资源">
              <Link to="/addResource">
                <Button type="primary" size="large">
                  推荐资源得积分
                </Button>
              </Link>
            </Empty>
          ),
        }}
        renderItem={(item) => {
          return (
            <List.Item key={item._id}>
              <ResourceCard
                resource={item}
                loading={loading}
                prePageState={searchParams}
                keyword={searchParams.name}
              />
            </List.Item>
          );
        }}
      />
    </PageContainer>
  ) : (
    <NoAuth />
  );
};

export default connect(({ user, tag }: ConnectState) => ({
  wholeTagsMap: tag.wholeTagsMap,
  currentUser: user.currentUser,
}))(Resources);
