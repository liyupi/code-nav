import React, { Component } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { NoAuth } from '@/components/NoAuth';
import styles from './style.less';

const { Item } = Menu;
type AccountSettingsProps = {
  dispatch: Dispatch;
  currentUser: CurrentUser;
  children: any;
  location: {
    pathname: string;
  };
};

type AccountSettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: string;
};

const menuMap: Record<string, React.ReactNode> = {
  '/account/info': '个人资料',
  '/account/like': '我的收藏',
  '/account/recommend': '推荐记录',
  '/account/message': '消息通知',
};

class AccountCenter extends Component<AccountSettingsProps, AccountSettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: AccountSettingsProps) {
    super(props);
    this.state = {
      mode: 'inline',
      selectKey: props.location.pathname ?? '/account/info',
    };
  }

  componentDidMount() {
    // 监听路由的变化，如果路由发生变化则进行相应操作
    history.listen((newLocation: any) => {
      this.setState({
        selectKey: newLocation.pathname ?? '/account/info',
      });
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: string) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  render() {
    const { currentUser, children } = this.props;

    if (!currentUser._id) {
      return <NoAuth />;
    }

    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => history.push(key)}>
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {children}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AccountCenter);
