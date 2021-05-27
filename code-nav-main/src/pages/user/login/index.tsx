import {Alert, message, Tabs, Tooltip} from 'antd';
import React, {useState} from 'react';
import ProForm, {ProFormText} from '@ant-design/pro-form';
import {QrcodeOutlined, QuestionCircleOutlined} from "@ant-design/icons/lib";
import type { Dispatch} from 'umi';
import {connect} from 'umi';
import type {LoginType} from '@/models/login';
import type {LoginParamsType} from '@/services/login';
import type {ConnectState} from '@/models/connect';
import qrcode from '@/assets/qrcode.jpg';
import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  userLogin: LoginType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const {userLogin = {}, submitting} = props;
  const {type: loginType} = userLogin;
  const [type, setType] = useState<string>('scan');

  const handleSubmit = (values: LoginParamsType) => {
    let {captcha = ""} = values;
    captcha = captcha.trim();
    if (!captcha || captcha.length !== 6) {
      message.error('请输入 6 位动态码！');
      return;
    }
    values.captcha = captcha;
    const {dispatch} = props;
    dispatch({
      type: 'login/login',
      payload: {...values, type},
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values: LoginParamsType) => {
          handleSubmit(values);
        }}
      >
        <Tabs activeKey={type} onChange={setType} centered={true}>
          <Tabs.TabPane
            key="scan"
            tab={'微信扫码关注『 编程导航 』登录'}
          />
        </Tabs>

        {loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        {type === 'scan' && (
          <>
            <img src={qrcode} className={styles.qrcode} alt="关注公众号『 编程导航 』登录" />
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <QrcodeOutlined className={styles.prefixIcon} />,
                addonAfter: <>
                  <Tooltip title='进入公众号，点一键登录获取动态码' placement="topRight" defaultVisible>
                    <QuestionCircleOutlined style={{color: 'rgba(0,0,0,.45)'}} />
                  </Tooltip>
                </>
              }}
              name="captcha"
              placeholder="请输入动态码（6位）"
              rules={[
                {
                  required: true,
                  message: '动态码是必填项！',
                },
              ]}
            />
          </>
        )}
      </ProForm>
    </div>
  );
};

export default connect(({login, loading}: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
