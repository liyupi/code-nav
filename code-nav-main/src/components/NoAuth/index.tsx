import {Button, Result} from "antd";
import * as React from "react";
import {Link} from 'umi';
import {stringify} from "qs";
import {FC} from "react";

export const NoAuth: FC = () => {
  return (
    <Result
      status={403}
      title="403"
      subTitle="该页面需要登录才能访问哦"
      extra={
        <Button type="primary" size="large">
          <Link to={{
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            })
          }}>
            登录
          </Link>
        </Button>
      }
    />
  )
}
