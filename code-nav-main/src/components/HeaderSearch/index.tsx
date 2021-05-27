import { AutoComplete, Input, Modal, Space } from 'antd';
import React, { CSSProperties, useState } from 'react';
import { history } from '@@/core/history';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  addSearchHistory,
  deleteAllSearchHistory,
  deleteSearchHistory,
  listSearchHistory,
} from '@/services/searchHistory';
import styles from './index.less';

export type HeaderSearchProps = {
  onSearch?: (value?: string) => void;
  onChange?: (value?: string) => void;
  defaultValue?: string;
  value?: string;
  style?: CSSProperties;
  placeholder?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const { style, placeholder } = props;
  const [searchHistoryList, setSearchHistoryList] = useState<string[]>(listSearchHistory());

  const handleSearch = (value: string) => {
    history.push({
      pathname: '/resources/',
      query: {
        q: value,
      },
    });
    addSearchHistory(value);
    setSearchHistoryList(listSearchHistory());
  };

  /**
   * 清空搜索历史
   */
  const clearAll = () => {
    if (searchHistoryList.length > 0) {
      Modal.confirm({
        title: '确定要清空搜索历史么？',
        onOk() {
          deleteAllSearchHistory();
          setSearchHistoryList(listSearchHistory());
        },
      });
    }
  };

  /**
   * 删除搜索历史
   * @param e
   * @param text
   */
  const delSearchHistory = (e: React.MouseEvent<HTMLAnchorElement>, text: string) => {
    deleteSearchHistory(text);
    setSearchHistoryList(listSearchHistory());
    e.stopPropagation();
  };

  /**
   * 渲染搜索历史标题
   */
  const renderSearchHistoryTitle = () => (
    <span>
      搜索历史
      <a style={{ float: 'right' }} onClick={clearAll}>
        <Space>
          <DeleteOutlined />
          清空
        </Space>
      </a>
    </span>
  );

  /**
   * 渲染搜索历史项
   * @param item
   */
  const renderSearchHistoryItem = (item: string) => ({
    value: item,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {item}
        <a onClick={(e) => delSearchHistory(e, item)} style={{ fontSize: 10 }}>
          <CloseOutlined />
        </a>
      </div>
    ),
  });

  /**
   * 选项组
   */
  const options = [
    {
      label: renderSearchHistoryTitle(),
      options: searchHistoryList.map((text) => renderSearchHistoryItem(text)),
    },
  ];

  return (
    <div className={styles.headerSearch} style={style}>
      <AutoComplete options={options} style={{ width: '100%' }}>
        <Input.Search placeholder={placeholder} size="large" enterButton onSearch={handleSearch} />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
