const reportReasonEnum = {
  CONTENT_EXPIRED: 0,
  CONTENT_ERROR: 1,
  OTHERS: 100,
};

/**
 * 举报原因信息映射
 */
export const REPORT_REASON_MAP =  {
  0: {
    text: '内容过期',
  },
  1: {
    text: '内容错误',
  },
  100: {
    text: '其他',
  }
}

/**
 * 举报类型映射
 */
export const REPORT_REASON_OPTIONS = [
  { label: '内容过期', value: reportReasonEnum.CONTENT_EXPIRED },
  { label: '内容错误', value: reportReasonEnum.CONTENT_ERROR },
  { label: '其他', value: reportReasonEnum.OTHERS },
];

export default reportReasonEnum;
