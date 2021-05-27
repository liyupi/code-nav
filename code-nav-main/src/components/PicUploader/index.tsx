import { message, Upload } from 'antd';
import React, { Component } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
// @ts-ignore
import type { RcCustomRequestOptions, UploadChangeParam } from 'antd/lib/upload/interface';
import { getFileUrl, uploadFile } from './service';
import './index.less';

function beforeUpload(file: File) {
  const isFileTypeValid =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/webp';
  if (!isFileTypeValid) {
    message.error('You can only upload JPG/PNG/SVG/WEBP file!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('Image must smaller than 1MB!');
  }
  return isFileTypeValid && isLt1M;
}

interface PicUploaderProps {
  onChange?: (url: string) => void;
  value?: string;
}

interface PicUploaderState {
  loading: boolean;
}

export default class PicUploader extends Component<PicUploaderProps, PicUploaderState> {
  state = {
    loading: false,
  };

  /**
   * 上传状态变更
   * @param info
   * @return {Promise<void>}
   */
  handleChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      console.log('img upload succeed');
    }
  };

  /**
   * 自实现上传
   * @param fileObj
   * @return {Promise<void>}
   */
  doUpload = async (fileObj: RcCustomRequestOptions) => {
    const res = await uploadFile(fileObj.file);
    if (!res || !res.fileID) {
      return;
    }
    const result = await getFileUrl(res.fileID);
    if (result && result.fileList) {
      this.setState({
        loading: false,
      });
      const { onChange } = this.props;
      if (onChange) {
        onChange(result.fileList[0].tempFileURL);
      }
      fileObj.onSuccess(result, fileObj.file);
    }
  };

  render() {
    const { loading } = this.state;
    const { value } = this.props;

    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <Upload
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        customRequest={this.doUpload}
      >
        {value ? <img src={value} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}
