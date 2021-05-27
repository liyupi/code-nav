import { Badge, Card, Descriptions, Image, message, Modal, Progress, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { RouteChildrenProps } from 'react-router';
import type { CurrentUser } from '@/models/user';
import type { ConnectState } from '@/models/connect';
import { getLevel } from '@/utils/businessUtils';
import { SettingTwoTone } from '@ant-design/icons/lib';
import { updateUserInterests } from '@/services/user';
import { NoAuth } from '@/components/NoAuth';
import SelectTags from '@/components/SelectTags';
import { WholeTagsMap } from '@/models/tag';
import styles from './Center.less';

type MyInfoProps = {
  dispatch: Dispatch;
  currentUser: CurrentUser;
  userId: string;
  wholeTagsMap: WholeTagsMap;
} & RouteChildrenProps;

type MyInfoState = {
  showInterestsModal: boolean;
  currInterests: string[];
  interestsSubmitting: boolean;
};

/**
 * 可设置的最大兴趣数
 */
const MAX_INTEREST_NUM = 5;

class MyInfo extends Component<MyInfoProps, MyInfoState> {
  state: MyInfoState = {
    showInterestsModal: false,
    currInterests: [],
    interestsSubmitting: false,
  };

  componentDidMount() {
    const { dispatch, userId, currentUser = {} } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {
        userId,
      },
    }).then(() => {
      this.setState({
        currInterests: currentUser.interests ?? [],
      });
    });
  }

  openInterestsModal = () => {
    const { currentUser } = this.props;
    this.setState({
      currInterests: currentUser.interests ?? [],
      showInterestsModal: true,
    });
  };

  saveInterests = async () => {
    const { dispatch, userId } = this.props;
    const { currInterests } = this.state;

    if (currInterests.length > MAX_INTEREST_NUM) {
      message.error(`最多设置 ${MAX_INTEREST_NUM} 个兴趣！`);
      return;
    }

    this.setState({
      interestsSubmitting: true,
    });
    const res = await updateUserInterests(currInterests);
    if (res) {
      message.success('保存成功');
      dispatch({
        type: 'user/fetchCurrent',
        payload: {
          userId,
        },
      });
    } else {
      message.error('保存失败');
    }
    this.setState({
      showInterestsModal: false,
      interestsSubmitting: false,
    });
  };

  doModalCancel = () => {
    const { currentUser } = this.props;

    this.setState({
      showInterestsModal: false,
      currInterests: currentUser.interests ?? [],
    });
  };

  onChange = (checkedKeys: any) => {
    this.setState({
      currInterests: checkedKeys,
    });
  };

  render() {
    const { showInterestsModal, currInterests, interestsSubmitting } = this.state;
    const { currentUser = {}, wholeTagsMap } = this.props;
    const dataLoading = !(currentUser && Object.keys(currentUser).length);
    const score = currentUser && currentUser.score ? currentUser.score : 0;
    const level = getLevel(score);

    const interestsTagView =
      currentUser?.interests && currentUser.interests.length > 0 ? (
        currentUser.interests.map((key) => {
          return (
            <Tag key={key} style={{ cursor: 'pointer' }}>
              {key}
            </Tag>
          );
        })
      ) : (
        <div style={{ color: '#999' }}>暂无，设置后推荐更精准哦</div>
      );

    return currentUser._id ? (
      <GridContent>
        <Badge.Ribbon text={currentUser?.title} className={currentUser?.title ? '' : 'hidden'}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
            <div className={styles.avatarHolder}>
              <Image className={styles.avatar} src={currentUser?.avatarUrl} />
              <div className={styles.name}>{currentUser?.nickName}</div>
              <Tag
                color={level.color}
                style={{ marginRight: 0, margin: '8px 0', userSelect: 'none' }}
              >
                {level.name}
              </Tag>
              <Tooltip title={`积分：${currentUser?.score} / ${level.score}`} placement="topRight">
                <Progress percent={(score * 100) / level.score} size="small" showInfo={false} />
              </Tooltip>
            </div>
            <Descriptions
              title="兴趣"
              column={1}
              extra={<SettingTwoTone style={{ fontSize: 16 }} onClick={this.openInterestsModal} />}
            >
              <Descriptions.Item>{interestsTagView}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Badge.Ribbon>
        <Modal
          title={`设置兴趣（至多 ${MAX_INTEREST_NUM} 个）`}
          visible={showInterestsModal}
          okText={interestsSubmitting ? '保存中' : '保存'}
          okButtonProps={{ loading: interestsSubmitting, disabled: interestsSubmitting }}
          onOk={this.saveInterests}
          onCancel={this.doModalCancel}
        >
          <SelectTags
            style={{ width: '100%' }}
            value={currInterests}
            allTags={wholeTagsMap.allTags}
            groupTags={wholeTagsMap.groupTags}
            maxTagsNumber={MAX_INTEREST_NUM}
            onChange={this.onChange}
          />
        </Modal>
      </GridContent>
    ) : (
      <NoAuth />
    );
  }
}

export default connect(({ user, login, tag }: ConnectState) => ({
  currentUser: user.currentUser,
  userId: login.userId,
  wholeTagsMap: tag.wholeTagsMap,
}))(MyInfo);
