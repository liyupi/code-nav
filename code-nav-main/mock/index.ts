/**
 * MOCK 开关
 */
export const MOCK_OPEN = true;

/**
 * 获取 Mock 数据
 * @param name
 */
export async function getMockData(name: string) {
  return mockData[name];
}

/**
 * key 函数名
 * value 数据
 */
const mockData = {
  login: {
    _id: 'test',
    avatarUrl:
      'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/1611148904143-1610274081627-%E9%B1%BC%E7%9A%AE.jpg',
    nickName: '鱼皮',
    interests: [],
    score: 100,
    title: '开发者',
    authority: 'admin',
  },
  searchResourcesByPage: {
    data: [
      {
        _createTime: new Date(),
        _id: 'cbddf0af60a7ebce0a46f97630295f70',
        _updateTime: new Date(),
        desc: '一个基于css3实现的漂亮的关键帧动画生成工具和类库',
        icon: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/1621617610096-WechatIMG20.jpeg',
        isDelete: false,
        likeNum: 0,
        link: 'http://bouncejs.com/',
        name: 'Bounce.js',
        publishTime: new Date(),
        rate: 0,
        rateNum: 0,
        reviewStatus: 1,
        reviewTime: new Date(),
        reviewerId: '79550af260247a27040274cf38be524c',
        shareNum: 0,
        tags: ['CSS', '动画', '类库', '工具', '前端'],
        userId: 'b00064a7603e749308032d1733ca8bbe',
        viewNum: 26,
      },
    ],
    total: 1,
  },
  getTags: {
    hotTags: ['教程', '书籍', '工具', '内推'],
    allTags: ['文章', '网页', '文档', 'APP', '视频'],
    groupTags: [
      {
        name: '热门',
        tags: ['教程', '书籍', '工具', '内推'],
      },
      {
        name: '语言',
        tags: ['Java', 'C#'],
      },
    ],
    userIntroduceGroupTags: [
      {
        name: '热门',
        tags: ['教程', '书籍', '工具', '内推'],
      },
      {
        name: '语言',
        tags: ['Java', 'C#'],
      },
    ],
    categoryTagsMap: {
      tutorial: {
        tags: ['入门', '文章', '视频'],
      },
      algorithm: {
        tags: ['教程', '书籍', '图解'],
      },
      system: {
        tags: ['教程', '操作系统'],
      },
    },
  },
  getResource: {
    _createTime: new Date(),
    _id: 'cbddf0af60a7ebce0a46f97630295f70',
    _updateTime: new Date(),
    desc: '一个基于css3实现的漂亮的关键帧动画生成工具和类库',
    icon: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/1621617610096-WechatIMG20.jpeg',
    isDelete: false,
    likeNum: 0,
    link: 'http://bouncejs.com/',
    name: 'Bounce.js',
    publishTime: new Date(),
    rate: 0,
    rateNum: 0,
    reviewStatus: 1,
    reviewTime: new Date(),
    reviewerId: '79550af260247a27040274cf38be524c',
    shareNum: 0,
    tags: ['CSS', '动画', '类库', '工具', '前端'],
    userId: 'b00064a7603e749308032d1733ca8bbe',
    viewNum: 26,
  },
  getUserSimpleInfo: {
    _id: 'test',
    avatarUrl:
      'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/1611148904143-1610274081627-%E9%B1%BC%E7%9A%AE.jpg',
    nickName: '鱼皮',
    interests: [],
    score: 100,
    title: '开发者',
    authority: 'admin',
  },
};
