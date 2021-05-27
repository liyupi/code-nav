import { getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps} from 'umi';
import { connect, Link } from 'umi';
import React from 'react';
import GlobalFooter from '@/components/GlobalFooter';
import logo from '../assets/logo.png';
import defaultSettings from '../../config/defaultSettings';
import styles from './UserLayout.less';

export type UserLayoutProps = Partial<ConnectProps>

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const title = getPageTitle({
    pathname: location.pathname,
    ...defaultSettings,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>编程导航</span>
              </Link>
            </div>
            <div className={styles.desc}>发现优质编程学习资源</div>
          </div>
          {children}
        </div>
        <GlobalFooter />
      </div>
    </HelmetProvider>
  );
};

export default connect()(UserLayout);
