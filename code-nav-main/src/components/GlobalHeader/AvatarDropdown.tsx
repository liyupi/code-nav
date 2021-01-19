import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Menu} from 'antd';
import React from 'react';
import {history, ConnectProps, connect, Link} from 'umi';
import {ConnectState} from '@/models/connect';
import {CurrentUser} from '@/models/user';
import styles from './index.less';
import classNames from "classnames";

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const {key} = event;

    if (key === 'logout') {
      const {dispatch} = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      currentUser,
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser?._id ? (
      <Dropdown overlayClassName={classNames(styles.container)} overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`} onClick={() => {
          if (location.pathname !== '/home') {
            history.push('/home');
          }
        }}>
          {currentUser.avatarUrl ? <Avatar size="small" className={styles.avatar} src={currentUser.avatarUrl} />
            : <Avatar size="small">无</Avatar>
          }
          {currentUser.nickName && <span>{currentUser.nickName}</span>}
        </span>
      </Dropdown>
    ) : (
      <Link to='/user/login'>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" icon={<UserOutlined />} /><span style={{marginLeft: 8}}>登录</span>
        </span>
      </Link>
    );
  }
}

export default connect(({user}: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
