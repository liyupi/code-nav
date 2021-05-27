import {Tag, Tooltip} from 'antd';
import type { CSSProperties} from "react";
import React, {Component} from "react";
import type {ResourceType} from "@/models/resource";
import reviewStatusEnum, {reviewStatusInfoMap} from "@/constant/reviewStatusEnum";
import styles from "./index.less";
import moment from "moment";

interface TagListProps {
  resource: ResourceType;
  loading?: boolean;
  showReview?: boolean; // 显示审核状态
  style?: CSSProperties;
}

class TagList extends Component<TagListProps> {

  render() {
    const {resource, showReview, style} = this.props;

    if (!resource) {
      return null;
    }

    if (!resource.tags) {
      resource.tags = [];
    }

    let tagListView = resource.tags.map((tag: string) => {
      return <Tag key={tag}>{tag}</Tag>;
    })

    // 额外标签
    const extraTags = [];

    if (resource.reviewStatus === reviewStatusEnum.PASS && moment(new Date()).diff(moment(resource.publishTime), 'days') <= 3) {
      extraTags.push(<Tag key="new" color="green">最新</Tag>);
    }

    if (resource.reviewStatus === reviewStatusEnum.PASS && resource.explain) {
      extraTags.push(<Tag key="explain" color="orange">秒懂</Tag>);
    }

    if (extraTags.length > 0) {
      tagListView = [...extraTags, ...tagListView];
    }

    return (
      <div className={styles.tagList} style={style}>
        {
          showReview &&
          <Tooltip title={resource.reviewMessage} defaultVisible>
            <Tag color={reviewStatusInfoMap[resource.reviewStatus].color}>{reviewStatusInfoMap[resource.reviewStatus].text}</Tag>
          </Tooltip>
        }
        {tagListView}
      </div>
    )
  }
}

export default TagList;
