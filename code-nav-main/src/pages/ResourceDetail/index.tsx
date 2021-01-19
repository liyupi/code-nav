import {Avatar, Card, Col, Descriptions, Divider, message, Row, Tag, Tooltip} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {GridContent} from '@ant-design/pro-layout';
import {connect, Dispatch, history} from 'umi';
import {RouteChildrenProps} from 'react-router';
import styles from './index.less';
import SimilarResources from "./components/SimilarResources";
import {getById, likeResource} from "@/services/resource";
import {ResourceType} from "@/models/resource";
import {ConnectState} from "@/models/connect";
import TagList from "@/components/TagList";
import moment from "moment";
import {CurrentUser, SimpleUser} from "@/models/user";
import {getSimpleById} from "@/services/user";
import {HeartOutlined, ShareAltOutlined} from "@ant-design/icons/lib";
import {doShare} from "@/utils/businessUtils";
import Cookies from "js-cookie";
import {LOGIN_STATUS} from "@/constant";
import {stringify} from "querystring";
import CommentList from "@/pages/ResourceDetail/components/CommentList";
import defaultPic from "@/assets/default.jpg";

const operationTabList = [
  {
    key: 'similar',
    tab: <span>相似推荐</span>,
  },
  {
    key: 'comment',
    tab: <span>评论</span>,
  },
];

interface ResourceDetailProps extends RouteChildrenProps {
  dispatch: Dispatch;
  currentUser?: CurrentUser;
}

interface ResourceDetailState {
  tabKey?: 'similar' | 'comment';
}

const ResourceDetail: FC<ResourceDetailProps> = (props) => {

  const {currentUser} = props;

  const [tabKey, setTabKey] = useState<ResourceDetailState['tabKey']>('similar');
  const [resource, setResource] = useState<ResourceType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SimpleUser>({});
  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  const resourceId = history.location.query['rid'];

  useEffect(() => {
    if (resourceId) {
      // todo 换成异步
      let res = getById(resourceId);
      if (res) {
        setResource(res);
        let user = getSimpleById(res.userId);
        setUser(user);
      }
      setLoading(false);
    }
  }, [resourceId]);

  const onTabChange = (key: ResourceDetailState['tabKey']) => {
    setTabKey(key);
  };

  const renderChildrenByTabKey = (tabKey: ResourceDetailState['tabKey']) => {
    if (tabKey === 'similar') {
      return <SimilarResources resource={resource} />;
    } else if (tabKey === 'comment') {
      return <CommentList resource={resource} />
    }
    return null;
  };

  const doLike = async () => {
    const loginStatus = Cookies.getJSON(LOGIN_STATUS);
    if (!loginStatus || !loginStatus.userId) {
      message.warning('登录后才能喜欢资源哦！');
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
      return;
    }
    if (!currentUser || !resource) {
      return;
    }
    if (!likeLoading && resource._id && currentUser._id) {
      setLikeLoading(true);
      const res = await likeResource(resource._id, currentUser._id);
      setLikeLoading(false);
      if (res) {
        message.success('操作成功！');
      }
    }
  }

  const momentObj = moment(resource?._createTime);
  const createTimeStr = `${momentObj.format('YYYY-MM-DD HH:mm')}（${momentObj.fromNow()}）`;

  return (
    <GridContent>
      <Row gutter={24}>
        <Col xl={16} lg={24} xs={24}>
          <Card bordered={false} style={{marginBottom: 24}} loading={loading}>
            {resource && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={resource.icon ?? defaultPic} />
                  <div className={styles.name}>{resource.name}</div>
                  <div className={styles.tagBar}>
                    <Tooltip title="喜欢">
                      <Tag icon={<HeartOutlined />} color="#cd201f" style={{marginLeft: 8}}
                           onClick={doLike}>
                        0
                      </Tag>
                    </Tooltip>
                    <Tooltip title='分享'>
                      <Tag icon={<ShareAltOutlined />} color="#55acee" style={{marginLeft: 8}}
                           onClick={() => doShare(resource)}>
                        0
                      </Tag>
                    </Tooltip>
                  </div>
                  <div>{resource.desc}</div>
                  <TagList resource={resource} style={{textAlign: 'center'}} />
                </div>
                <Divider dashed />
                <Descriptions column={1}>
                  {resource.link &&
                  <Descriptions.Item label="链接"><a href={resource.link}
                                                   target="_blank">{resource.link}</a></Descriptions.Item>}
                  {resource.detail && <Descriptions.Item label="详情">{resource.detail}</Descriptions.Item>}
                  <Descriptions.Item label="时间">{createTimeStr}</Descriptions.Item>
                  <Descriptions.Item label="荐者">
                    <div><Avatar src={user?.avatarUrl} style={{marginRight: 5}} /> {user?.nickName}</div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </Card>
        </Col>
        <Col xl={8} lg={24} xs={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={(key) => onTabChange(key as ResourceDetailState['tabKey'])}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
}

export default connect(({form, category, user}: ConnectState) => ({
  currentUser: user.currentUser,
}))(ResourceDetail);
