import {getApp} from "@/tcb";
import {message} from "antd";

const app = getApp();

export function uploadFile(file: File) {
  return app.uploadFile({
    cloudPath: `img/${new Date().getTime()}-${file.name}`,
    // @ts-ignore
    filePath: file,
  }).catch(e => {
    message.error('上传失败，请重试');
  });
}

export function getFileUrl(fileId: any) {
  return app.getTempFileURL({
    fileList: [fileId]
  });
}
