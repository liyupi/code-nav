import {Avatar, Card, message, Tooltip} from 'antd';
import React, {FC, useState} from "react";
import {history, connect} from 'umi';
import styles from "./index.less";
import {
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {ResourceType} from "@/models/resource";
import {likeResource} from "@/services/resource";
import {ConnectState} from "@/models/connect";
import {CurrentUser} from "@/models/user";
import {
  EditOutlined,
  LoginOutlined
} from "@ant-design/icons/lib";
import defaultPic from "@/assets/default.jpg";
import TagList from "@/components/TagList";
import {doShare} from "@/utils/businessUtils";

interface ResourceCardProps {
  resource: ResourceType;
  loading?: boolean;
  showReview?: boolean; // 显示审核状态
  showEdit?: boolean; // 显示修改
  currentUser?: CurrentUser;
  showActions?: boolean; // 展示操作栏
}

const ResourceCard: FC<ResourceCardProps> = (props) => {

  const {currentUser, resource = {} as ResourceType, loading, showReview, showEdit, showActions = true} = props;

  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  const doLike = async () => {
    if (!currentUser || !resource._id) {
      return;
    }
    if (!likeLoading && resource._id && currentUser._id) {
      setLikeLoading(true);
      const res = await likeResource(resource._id, currentUser._id);
      if (res) {
        message.success('操作成功！');
      }
      setLikeLoading(false);
    }
  }

  const doSearch = () => {
    window.open("http://www.baidu.com/s?wd=" + resource.link);
  }

  const doEdit = () => {
    history.push({
      pathname: '/addResource',
      query: {
        rid: resource._id,
      }
    })
  }

  const toDetail = () => {
    if (showActions) {
      history.push({
        pathname: '/rd',
        query: {
          rid: resource._id,
        }
      })
    }
  }

  const actions = showActions ? [
    <Tooltip title="喜欢">
      <div onClick={doLike}>
        <HeartOutlined /> 0
      </div>
    </Tooltip>,
    <Tooltip title='分享'>
      <div onClick={() => doShare(resource)}>
        <ShareAltOutlined /> 0
      </div>
    </Tooltip>,
    <Tooltip title='访问'>
      <LoginOutlined onClick={doSearch} />
    </Tooltip>,
  ] : [];

  // 允许修改
  if (showEdit) {
    actions.push(<div onClick={doEdit}><EditOutlined /></div>);
  }

  return (
    <Card
      className={styles.card}
      hoverable
      actions={actions}
      loading={loading}
    >
      <div onClick={toDetail}>
        <Card.Meta
          avatar={<Avatar src={resource.icon ? resource.icon : defaultPic} />}
          className={styles.cardMeta}
          title={resource.name}
          description={resource.desc}
        />
      </div>
      <TagList resource={resource} showReview={showReview} />
    </Card>
  );
}

export default connect(({user}: ConnectState) => ({
  currentUser: user.currentUser,
}))(ResourceCard);
