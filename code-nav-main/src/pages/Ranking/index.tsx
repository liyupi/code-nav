import type { FC} from 'react';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser, SimpleUser } from '@/models/user';
import { getUserRank, listUserCycleRank, listUserTotalRank } from '@/services/user';
import {Avatar, Button, Card, Col, DatePicker, List, message, Modal, Row} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type {Moment} from "moment";
import moment from "moment";

interface RankingProps {
  currentUser: CurrentUser;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * 激励榜
 * @param props
 * @constructor
 */
const Ranking: FC<RankingProps> = (props) => {
  const { currentUser } = props;
  const [userList, setUserList] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weekList, setWeekList] = useState<SimpleUser[]>([]);
  const [weekMoment, setWeekMoment] = useState<Moment | null>(moment());
  const [weekLoading, setWeekLoading] = useState<boolean>(true);
  const [monthList, setMonthList] = useState<SimpleUser[]>([]);
  const [monthMoment, setMonthMoment] = useState<Moment | null>(moment());
  const [monthLoading, setMonthLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 总榜
  useEffect(() => {
    setLoading(true);
    listUserTotalRank(DEFAULT_PAGE_SIZE)
      .then((data) => {
        setUserList(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // 周榜
  useEffect(() => {
    if (!weekMoment) {
      return;
    }
    setWeekLoading(true);
    listUserCycleRank(0, weekMoment.startOf('week').format('YYYY-MM-DD'))
      .then((data) => {
        setWeekList(data);
      })
      .finally(() => setWeekLoading(false));
  }, [weekMoment]);

  // 月榜
  useEffect(() => {
    if (!monthMoment) {
      return;
    }
    setMonthLoading(true);
    // 月榜
    listUserCycleRank(1, monthMoment.startOf('month').format('YYYY-MM-DD'))
      .then((data) => {
        setMonthList(data);
      })
      .finally(() => setMonthLoading(false));
  }, [monthMoment]);

  const getMyRank = async () => {
    if (!currentUser._id) {
      message.error('请先登录');
      return;
    }
    setSubmitting(true);
    const rank = await getUserRank(currentUser._id);
    Modal.success({
      content: (
        <div>
          您的排名为 <b>{rank}</b>，请继续努力{' '}
          <a href="https://doc.code-nav.cn/prize" target="_blank" rel="noreferrer">
            赚取积分
          </a>{' '}
          💰！
        </div>
      ),
      maskClosable: true,
    });
    setSubmitting(false);
  };

  /**
   * 查询我的总排名按钮
   */
  const queryRankBtnView = (
    <Button
      type="primary"
      icon={<SearchOutlined />}
      loading={submitting}
      onClick={getMyRank}
    >
      我的排名
    </Button>
  );

  const onWeekChange = (mo: Moment | null) => {
    setWeekMoment(mo);
  }

  /**
   * 周选择器
   */
  const selectWeekView = (
    <DatePicker value={weekMoment} picker="week" onChange={onWeekChange}  />
  );

  const onMonthChange = (mo: Moment | null) => {
    setMonthMoment(mo);
  }

  /**
   * 月选择器
   */
  const selectMonthView = (
    <DatePicker value={monthMoment} picker="month" onChange={onMonthChange}  />
  );

  return (
    <PageContainer title="🏆 激励榜">
      <Row gutter={24}>
        <Col xl={8} md={12} xs={24} style={{ marginBottom: 24 }}>
          <Card title="总积分榜" extra={queryRankBtnView}>
            <List
              loading={loading}
              dataSource={userList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatarUrl} />}
                    title={item.nickName}
                    description={`积分：${item.score}`}
                  />
                  <div> TOP {index + 1}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xl={8} md={12} xs={24} style={{ marginBottom: 24 }}>
          <Card title="积分周榜" extra={selectWeekView}>
            <List
              loading={weekLoading}
              dataSource={weekList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatarUrl} />}
                    title={item.nickName}
                    description={`本周积分：${item.score}`}
                  />
                  <div> TOP {index + 1}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xl={8} md={12} xs={24} style={{ marginBottom: 24 }}>
          <Card title="积分月榜" extra={selectMonthView}>
            <List
              loading={monthLoading}
              dataSource={monthList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatarUrl} />}
                    title={item.nickName}
                    description={`本月积分：${item.score}`}
                  />
                  <div> TOP {index + 1}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(Ranking);

