import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  message,
  Rate,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import type { ConnectState } from '@/models/connect';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';
import type { RouteChildrenProps } from 'react-router';
import { getResource, likeResource, viewResource } from '@/services/resource';
import type { ResourceType } from '@/models/resource';
import TagList from '@/components/TagList';
import moment from 'moment';
import type { CurrentUser, SimpleUser } from '@/models/user';
import { getUserSimpleInfo } from '@/services/user';
import {
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  ShareAltOutlined,
  WarningOutlined,
} from '@ant-design/icons/lib';
import Cookies from 'js-cookie';
import { LOGIN_STATUS } from '@/constant';
import { stringify } from 'querystring';
import CommentList from '@/pages/ResourceDetail/components/CommentList';
import ReportModal from '@/components/ReportModal';
import ResourceRejectModal from '@/components/ResourceRejectModal';
import defaultPic from '@/assets/default.jpg';
import { beautifyDetail, getRate } from '@/utils/utils';
import { doShare } from '@/utils/businessUtils';
import reviewStatusEnum from '@/constant/reviewStatusEnum';
import reportTypeEnum from '@/constant/reportTypeEnum';
import SimilarResources from './components/SimilarResources';
import styles from './index.less';

interface ResourceDetailProps extends RouteChildrenProps {
  dispatch: Dispatch;
  currentUser: CurrentUser;
  currentAuthority: string;
}

const ResourceDetail: FC<ResourceDetailProps> = (props) => {
  const { currentUser, currentAuthority = 'guest', dispatch } = props;

  const [resource, setResource] = useState<ResourceType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SimpleUser>({});
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeNum, setLikeNum] = useState<number>(0);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const resourceId = history.location.query?.rid as string;

  useEffect(() => {
    if (resourceId) {
      getResource(resourceId)
        ?.then((res) => {
          if (res) {
            setResource(res);
            getUserSimpleInfo(res.userId)?.then((tmpUser) => {
              setUser(tmpUser);
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
      // 浏览量 +1
      viewResource(resourceId);
    }
  }, [resourceId]);

  useEffect(() => {
    if (resource) {
      setIsLike(currentUser.likeResourceIds?.includes(resource._id) ?? false);
      setLikeNum(resource.likeNum ?? 0);
    }
  }, [currentUser, resource]);

  const doLike = async () => {
    const loginStatus = Cookies.getJSON(LOGIN_STATUS);
    if (!loginStatus || !loginStatus.userId) {
      message.warning('登录后才能收藏资源哦！');
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
      return;
    }
    if (!currentUser._id || !resource) {
      return;
    }
    if (resource.reviewStatus !== reviewStatusEnum.PASS) {
      message.error('审核通过后才能收藏哦');
      return;
    }
    if (!likeLoading && resource._id && currentUser._id) {
      setLikeLoading(true);
      const res = await likeResource(resource._id);
      setLikeLoading(false);
      setLikeNum(likeNum + res);
      if (res !== 0) {
        setIsLike(res > 0);
        resource.likeNum = likeNum + res;
        dispatch({
          type: 'user/fetchCurrent',
          payload: {
            userId: currentUser._id,
          },
        });
      } else {
        message.error('操作失败');
      }
    }
  };

  /**
   * 返回上一页
   */
  const goBack = () => {
    history.go(-1);
  };

  /**
   * 海搜
   */
  const doSuperSearch = () => {
    if (resource && resource.name) {
      const searchText = resource.name;
      window.open(`https://home.code-nav.cn/search?q=${searchText}`);
    }
  };

  const momentObj = moment(resource?.publishTime);
  const publishTimeStr = `${momentObj.format('YYYY-MM-DD HH:mm')}（${momentObj.fromNow()}）`;
  const rate = getRate(resource);

  const actions = [
    <div onClick={() => doShare(resource)}>
      <Space>
        <ShareAltOutlined /> 分享
      </Space>
    </div>,
    <Tooltip title="一键从全网搜索资源信息">
      <div onClick={() => doSuperSearch()}>
        <Space>
          <SearchOutlined /> 海搜
        </Space>
      </div>
    </Tooltip>,
    <div onClick={() => setShowReportModal(true)}>
      <Space>
        <WarningOutlined /> 举报
      </Space>
    </div>,
  ];

  if (currentAuthority.includes('admin')) {
    actions.push(
      <div onClick={() => setShowRejectModal(true)}>
        <Space>
          <MinusCircleOutlined /> 下架
        </Space>
      </div>,
    );
  }

  return (
    <GridContent>
      <Row gutter={24}>
        <Col xl={16} lg={24} xs={24}>
          <Badge.Ribbon
            text={
              rate && (
                <Rate
                  disabled
                  allowHalf
                  count={rate}
                  defaultValue={rate}
                  className={styles.starRate}
                />
              )
            }
            style={{
              padding: '0 12px',
              background: 'rgba(0, 0, 0, 0.4)',
              display: rate ? '' : 'none',
            }}
          >
            <Card bordered={false} style={{ marginBottom: 24 }} loading={loading} actions={actions}>
              <Button type="link" style={{ padding: 0, marginBottom: 16 }} onClick={goBack}>
                <LeftOutlined /> 返回
              </Button>
              {resource && (
                <div>
                  <div className={styles.avatarHolder}>
                    <Image alt={resource.name} src={resource.icon ?? defaultPic} height={100} />
                    <div className={styles.name}>{resource.name}</div>
                    <div className={styles.tagBar}>
                      <Tooltip title="浏览量">
                        <Tag
                          icon={<EyeOutlined />}
                          color="#aaa"
                          style={{ marginLeft: 8, cursor: 'pointer' }}
                        >
                          {resource.viewNum ?? 0}
                        </Tag>
                      </Tooltip>
                      <Tooltip title={isLike ? '取消收藏' : '收藏'}>
                        <Tag
                          icon={isLike ? <HeartFilled /> : <HeartOutlined />}
                          color="#cd201f"
                          style={{ marginLeft: 8, cursor: 'pointer' }}
                          onClick={doLike}
                        >
                          {likeNum}
                        </Tag>
                      </Tooltip>
                      <Tag
                        icon={<ShareAltOutlined />}
                        color="#55acee"
                        style={{ marginLeft: 8, cursor: 'pointer' }}
                        onClick={() => doShare(resource)}
                      >
                        分享
                      </Tag>
                    </div>
                    <div>{resource.desc}</div>
                    <TagList resource={resource} style={{ textAlign: 'center' }} />
                  </div>
                  <Divider dashed />
                  <Descriptions column={1}>
                    {resource.link && (
                      <Descriptions.Item label="链接">
                        <Typography.Paragraph
                          copyable={{ text: resource.link }}
                          style={{ marginBottom: 0 }}
                        >
                          {/* eslint-disable-next-line react/jsx-no-target-blank */}
                          <a href={resource.link} target="_blank">
                            {resource.link}
                          </a>
                        </Typography.Paragraph>
                      </Descriptions.Item>
                    )}
                    {resource.detail && (
                      <Descriptions.Item label="详情">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: beautifyDetail(resource.detail) ?? '',
                          }}
                        />
                      </Descriptions.Item>
                    )}
                    {resource.explain && (
                      <Descriptions.Item label="秒懂">
                        <Typography.Paragraph
                          copyable={{ text: resource.explain }}
                          style={{ marginBottom: 0 }}
                        >
                          <a href={resource.explain} target="_blank" rel="noreferrer">
                            {resource.explain}
                          </a>
                        </Typography.Paragraph>
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="时间">{publishTimeStr}</Descriptions.Item>
                    <Descriptions.Item label="荐者">
                      <Avatar src={user?.avatarUrl} style={{ marginRight: 5 }} /> {user?.nickName}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              )}
            </Card>
          </Badge.Ribbon>
          <Card title="评论" bodyStyle={{ paddingTop: 8 }}>
            <CommentList resource={resource} />
          </Card>
          <div style={{ marginBottom: 24 }} />
        </Col>
        <Col xl={8} lg={24} xs={24}>
          <Card title="相似资源">
            <SimilarResources resource={resource} />
          </Card>
        </Col>
      </Row>
      <ReportModal
        visible={showReportModal}
        reportType={reportTypeEnum.RESOURCE}
        reportResourceId={resource?._id}
        reportedUserId={user._id}
        onClose={() => setShowReportModal(false)}
      />
      <ResourceRejectModal
        visible={showRejectModal}
        resourceId={resource?._id}
        onClose={() => setShowRejectModal(false)}
      />
    </GridContent>
  );
};

export default connect(({ user, login }: ConnectState) => ({
  currentUser: user.currentUser,
  currentAuthority: login.currentAuthority,
}))(ResourceDetail);
