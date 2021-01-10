import {Avatar, List, Tooltip, Comment} from 'antd';
import React, {useEffect, useState} from 'react';
import {ResourceType} from "@/models/resource";
import {search} from "@/services/resource";
import moment from 'moment';

interface CommentListProps {
  // 参照资源
  resource?: ResourceType;
}

/**
 * 相似资源
 * @param props
 * @constructor
 */
const CommentList: React.FC<CommentListProps> = (props) => {

  const {resource} = props;

  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (resource) {
      search({
        category: "test",
        pageSize: 3,
      }).then((res: ResourceType[]) => {
        setResources(res);
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [resource])

  return (
    <List<ResourceType>
      rowKey="id"
      dataSource={resources}
      split={false}
      loading={loading}
      renderItem={(item) => {
        return (
          <List.Item key={item._id}>
            <Comment
              actions={[]}
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <p>
                  We supply a series of design principles, practical patterns and high quality design
                  resources (Sketch and Axure), to help people create their product prototypes beautifully
                  and efficiently.
                </p>
              }
              datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default CommentList;
