import {getApp} from "@/tcb";

// 云开发对象
const app = getApp();

/**
 * 上传文件
 * @param file
 */
export function uploadFile(file: File) {
  // todo 请求
  return {
    fileID: "test",
  };
}

/**
 * 下载文件
 * @param fileId
 */
export function getFileUrl(fileId: any) {
  // todo 请求
  return {
    fileList: [{
      tempFileURL: "test",
    }],
  }
}
