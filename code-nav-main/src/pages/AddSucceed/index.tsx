import {Button, Card, message, Result} from 'antd';
import React, {Fragment, useEffect, useState} from 'react';
import {history, Link} from 'umi';
import {GridContent} from '@ant-design/pro-layout';
import styles from './index.less';
import ResourceCard from "@/components/ResourceCard";
import {getResource} from "@/services/resource";
import {ResourceType} from "@/models/resource";

const extra = (
  <Fragment>
    <Link to='/addResource'><Button type="primary">继续推荐</Button></Link>
    <Link to='/account/info'><Button>返回主页</Button></Link>
  </Fragment>
);

export default () => {

  const resourceId = history.location.query?.['rid'] as string;
  const [resource, setResource] = useState<ResourceType>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (resourceId) {
      getResource(resourceId)?.then(res => {
        if (res) {
          setResource(res);
        } else {
          message.error('加载失败');
        }
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [resourceId]);

  return (
    <GridContent className={styles.addSucceed}>
      <Card style={{marginBottom: '16px'}}>
        <Result
          status="success"
          title="提交成功"
          subTitle={<div>感谢您的推荐，将尽快审核！<br />通过后自动发布并送您积分</div>}
          extra={extra}
        />
      </Card>
      <div style={{maxWidth: 400, margin: '0 auto'}}>
        <ResourceCard resource={resource} loading={loading} showActions={false} />
      </div>
    </GridContent>
  )
}




