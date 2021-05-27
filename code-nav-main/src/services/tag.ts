import {getApp} from "@/tcb";
import {getMockData, MOCK_OPEN} from "../../mock";

const app = getApp();

/**
 * 获取标签
 */
export function getTags() {
  if (MOCK_OPEN) {
    return getMockData(getTags.name);
  }

  return app.callFunction({
    name: 'getTags',
    data: {}
  }).then((res: any) => {
    console.log(`getTags succeed`);
    return res.result;
  }).catch((e: any) => {
    console.error(`getTags error`, e);
    return false;
  });
}
