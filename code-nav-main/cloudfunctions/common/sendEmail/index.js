/**
 * 发送邮件  sendEmail
 *
 * @Author cjf
 * @param to   收件人
 * @param subject   主题
 * @param content   正文
 * @return bool  true / error (成功 / 错误)
 */
const nodemailer = require('nodemailer');
const transporter_config = require('./transporter.json');

exports.main = async (event, context) => {
  const {to, subject, content} = event;
  if (!to || !subject || !content) {
    return null;
  }

  let mailOptions = {
    from: 'xx@qq.com', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    // 发送text或者html格式
    text: content, // plain text body
    //   html: '<b>Hello world?</b>' // html body
  };

  let transporter = nodemailer.createTransport(transporter_config);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error)
      return error;
    } else {
      return true;
    }
    console.log('Message sent: %s', info.messageId);
  });
  return true;
};
