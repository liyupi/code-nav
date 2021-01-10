import { Settings as ProSettings } from '@ant-design/pro-layout';
import React from 'react';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <AvatarDropdown />
    </div>
  );
};

export default GlobalHeaderRight;
