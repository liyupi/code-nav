import {Tag} from 'antd';
import React, {Component, CSSProperties} from "react";
import {connect} from 'umi';
import {ResourceType} from "@/models/resource";
import styles from "./index.less";

interface TagListProps {
  resource: ResourceType;
  loading?: boolean;
  style?: CSSProperties;
}

class TagList extends Component<TagListProps> {

  render() {
    const {resource, style} = this.props;

    const tagListView = resource.tags && resource.tags.map((tag: string) => {
      return <Tag key={tag}>{tag}</Tag>;
    })

    return (
      <div className={styles.tagList} style={style}>
        <Tag color="magenta">前端天地</Tag>
        <Tag color="orange">网页</Tag>
        {tagListView}
      </div>
    )
  }
}

export default connect()(TagList);
