import React, {useState} from 'react';
import {Avatar, Col, Layout, Menu, Row} from "antd";
import Search from "antd/es/input/Search";
import {Header} from "antd/es/layout/layout";
import {useLocation} from "@reach/router";
import {parse} from "query-string";
import {createFromIconfontCN} from '@ant-design/icons';
import logo from '../../assets/logo.png';
import {WEB_HOST} from "../../constant";

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2316101_26mu1eoa684h.js',
});

/**
 * 万能搜索页
 * @author codenav
 * @return {*}
 */
export default () => {

  const location = useLocation();
  const searchParams = parse(location.search)
  const [current, setCurrent] = useState('baidu');
  const [searchText, setSearchText] = useState(searchParams['q']);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const toNav = () => {
    window.open(WEB_HOST);
  }

  return (
    <div>
      <Layout>
        <Header style={{zIndex: 10}}>
          <Row align="middle" justify="center">
            <Col xl={1} lg={2} md={2} sm={3} xs={4}>
              <div onClick={toNav} style={{cursor: 'pointer'}}><Avatar shape="square" src={logo} /></div>
            </Col>
            <Col xl={7} lg={8} md={10} sm={11} xs={20}>
              <Search enterButton style={{display: 'block'}} size="large" defaultValue={searchText}
                      onSearch={(value) => setSearchText(value)} />
            </Col>
            <Col xl={16} lg={14} md={12} sm={10} xs={24}>
              <Menu theme="dark" mode="horizontal" selectedKeys={[current]} onClick={handleClick}
                    style={{float: 'right'}}>
                <Menu.Item key="baidu"><IconFont type="icon-baidu" />百度</Menu.Item>
                <Menu.Item key="bing"><IconFont type="icon-bing" />必应</Menu.Item>
                <Menu.Item key="360"><IconFont type="icon-360logo" />360</Menu.Item>
                <Menu.Item key="sogou"><IconFont type="icon-sogou" />搜狗</Menu.Item>
                <Menu.Item key="bilibili"><IconFont type="icon-bilibili-line" />B 站</Menu.Item>
                <Menu.Item key="gitee"><IconFont type="icon-gitee-fill-round" />Gitee</Menu.Item>
                <Menu.Item key="code" onClick={toNav}><IconFont type="icon-code" />编程</Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Header>
        {
          current === "baidu" &&
          <iframe src={`https://www.baidu.com/s?wd=${searchText}`}
                  style={{border: 'none', width: '100%', height: '100vh', position: 'fixed', top: -32, zIndex: 1}}
          />
        }
        {
          current === "bing" &&
          <iframe src={`https://cn.bing.com/search?q=${searchText}`}
                  style={{border: 'none', width: '100%', height: '100vh', position: 'fixed', top: -30, zIndex: 1}}
          />
        }
        {
          current === "360" &&
          <iframe src={`https://www.so.com/s?q=${searchText}`}
                  style={{border: 'none', width: '100%', height: '100vh', position: 'fixed', top: -30, zIndex: 1}}
          />
        }
        {
          current === "sogou" &&
          <iframe src={`https://www.sogou.com/web?query=${searchText}`}
                  style={{border: 'none', width: '100%', height: '100vh', position: 'fixed', top: -30, zIndex: 1}}
          />
        }
        {
          current === "bilibili" &&
          <iframe src={`https://search.bilibili.com/all?keyword=${searchText}`}
                  style={{border: 'none', width: '100%', height: '100vh', position: 'fixed', top: -80, zIndex: 1}}
          />
        }
        {
          current === "gitee" &&
          <iframe src={`https://search.gitee.com/?q=${searchText}`}
                  style={{border: 'none', width: '100%', height: '100vh', position: 'fixed', top: -50, zIndex: 1}}
          />
        }
      </Layout>
    </div>
  )
}
