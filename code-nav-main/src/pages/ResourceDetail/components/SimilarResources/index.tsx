import { List } from 'antd';
import React, { useEffect, useState } from 'react';
import type { ResourceType } from '@/models/resource';
import ResourceCard from '@/components/ResourceCard';
import { searchResources } from '@/services/resource';
import reviewStatusEnum from '@/constant/reviewStatusEnum';

interface SimilarResourcesProps {
  // 参照资源
  resource?: ResourceType;
}

/**
 * 相似资源
 * @param props
 * @constructor
 */
const SimilarResources: React.FC<SimilarResourcesProps> = (props) => {
  const { resource } = props;

  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (resource) {
      searchResources({
        tags: [resource.tags[0]],
        pageSize: 3,
        reviewStatus: reviewStatusEnum.PASS,
        notId: resource._id,
      })
        .then((res: ResourceType[]) => {
          setResources(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [resource]);

  return (
    <List<ResourceType>
      rowKey="id"
      dataSource={resources}
      split={false}
      loading={loading}
      renderItem={(item) => {
        return (
          <List.Item key={item._id}>
            <ResourceCard resource={item} />
          </List.Item>
        );
      }}
    />
  );
};

export default SimilarResources;
