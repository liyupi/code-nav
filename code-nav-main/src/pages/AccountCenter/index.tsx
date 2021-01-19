import {Card, Col, Row, Badge, Tag, Progress, Tooltip, Descriptions, Modal, Tree, message} from 'antd';
import React, {Component} from 'react';
import {GridContent} from '@ant-design/pro-layout';
import {connect, Dispatch, history} from 'umi';
import {RouteChildrenProps} from 'react-router';
import styles from './Center.less';
import {CurrentUser} from "@/models/user";
import {ConnectState} from "@/models/connect";
import MyAddResources from "@/pages/AccountCenter/components/MyAddResources";
import MyLikeResources from "@/pages/AccountCenter/components/MyLikeResources";
import {getLevel} from "@/utils/businessUtils";
import {DownOutlined, SettingTwoTone} from "@ant-design/icons/lib";
import {CategoryType} from "@/models/category";
import {update} from "@/services/user";
import {NoAuth} from "@/components/NoAuth";

const operationTabList = [
  {
    key: 'myLike',
    tab: <span>我喜欢</span>,
  },
  {
    key: 'myAdd',
    tab: <span>我推荐</span>,
  },
];

interface AccountCenterProps extends RouteChildrenProps {
  dispatch: Dispatch;
  currentUser: CurrentUser;
  userId: string;
  keyCategoryMap: { [key: string]: CategoryType };
  categoryTreeData: any;
}

interface AccountCenterState {
  tabKey?: 'myLike' | 'myAdd';
  showInterestsModal: boolean;
  currInterests: string[];
}

class AccountCenter extends Component<AccountCenterProps, AccountCenterState> {

  state: AccountCenterState = {
    tabKey: 'myLike',
    showInterestsModal: false,
    currInterests: [],
  };

  componentDidMount() {
    const {dispatch, userId, currentUser = {}} = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {
        userId,
      }
    }).then(() => {
      this.setState({
        currInterests: currentUser.interests ?? [],
      })
    });
  }

  onTabChange = (key: string) => {
    this.setState({
      tabKey: key as AccountCenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: AccountCenterState['tabKey']) => {
    if (tabKey === 'myLike') {
      return <MyLikeResources />;
    } else if (tabKey === 'myAdd') {
      return <MyAddResources />;
    }
    return null;
  };

  openInterestsModal = () => {
    const {currentUser} = this.props;
    this.setState({
      currInterests: currentUser.interests ?? [],
      showInterestsModal: true,
    })
  }

  saveInterests = async () => {
    const {dispatch, userId} = this.props;
    const {currInterests} = this.state;

    if (currInterests.length > 10) {
      message.error('最多设置 10 个兴趣！');
      return;
    }

    let res = await update(userId, {interests: currInterests})
    if (res) {
      message.success('保存成功');
      dispatch({
        type: 'user/fetchCurrent',
        payload: {
          userId,
        }
      })
    } else {
      message.error('保存失败');
    }
    this.setState({
      showInterestsModal: false,
    })
  }

  doModalCancel = () => {
    const {currentUser} = this.props;

    this.setState({
      showInterestsModal: false,
      currInterests: currentUser.interests ?? [],
    })
  }

  onCheck = (checkedKeys: any) => {
    this.setState({
      currInterests: checkedKeys.checked,
    })
  };

  render() {
    const {tabKey, showInterestsModal, currInterests} = this.state;
    const {currentUser = {}, categoryTreeData} = this.props;
    const dataLoading = !(currentUser && Object.keys(currentUser).length);
    const score = currentUser && currentUser.score ? currentUser.score : 0;
    const level = getLevel(score);

    const interestsTagView = currentUser?.interests && currentUser.interests.length > 0 ?
      currentUser.interests.map(key => {
        return <Tag key={key} style={{cursor: 'pointer'}} onClick={() => history.push(`/resources/${key}`)}>
          {key}
        </Tag>;
      }) : <div style={{color: '#999'}}>暂无，设置后可快速导航、精准推荐</div>

    return (
      currentUser._id ? <GridContent>
        <Row gutter={24}>
          <Col xxl={6} md={7} xs={24}>
            <Badge.Ribbon text={currentUser?.title} className={currentUser?.title ? '' : 'hidden'}>
              <Card bordered={false} style={{marginBottom: 24}} loading={dataLoading}>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser?.avatarUrl} />
                  <div className={styles.name}>{currentUser?.nickName}</div>
                  <Tag color={level.color} style={{marginRight: 0, margin: '8px 0', userSelect: 'none'}}>
                    {level.name}
                  </Tag>
                  <Tooltip title={`积分：${currentUser?.score} / ${level.score}`} placement="topRight">
                    <Progress percent={score * 100 / level.score} size="small" showInfo={false} />
                  </Tooltip>
                </div>
                <Descriptions title="兴趣" column={1} extra={
                  <SettingTwoTone style={{fontSize: 16}} onClick={this.openInterestsModal} />
                }>
                  <Descriptions.Item>
                    {interestsTagView}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Badge.Ribbon>
          </Col>
          <Col xxl={18} md={17} xs={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {currentUser && this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
        <Modal title="设置兴趣" visible={showInterestsModal} okText="保存" onOk={this.saveInterests}
               onCancel={this.doModalCancel}>
          <Tree
            checkable
            selectable={false}
            checkedKeys={currInterests}
            treeData={categoryTreeData}
            switcherIcon={<DownOutlined />}
            onCheck={this.onCheck}
            checkStrictly
          />
        </Modal>
      </GridContent> : <NoAuth />
    );
  }
}

export default connect(({user, login, category}: ConnectState) => ({
  currentUser: user.currentUser,
  userId: login.userId,
}))(AccountCenter);
