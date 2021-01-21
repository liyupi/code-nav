import {COVER_HOST} from "./index";

export const DEFAULT_COVER = {
  name: '满天繁星',
  preview: '/dynamic/stars/preview.png',
  src: '/dynamic/stars/index.html',
  type: 'iframe',
}

const sceneryList = Array.from(Array(12), (v, k) => {
  let num = k + 1;
  return {
    name: `风景 ${num}`,
    preview: `/scenery/preview/cover_${num}.jpg`,
    src: `/scenery/cover_${num}.jpg`,
    type: 'image',
  }
})

const starList = Array.from(Array(12), (v, k) => {
  let num = k + 1;
  return {
    name: `星空 ${num}`,
    preview: `/star/preview/cover_${num}.jpg`,
    src: `/star/cover_${num}.jpg`,
    type: 'image',
  }
})

const poolList = Array.from(Array(12), (v, k) => {
  let num = k + 1;
  return {
    name: `淡雅 ${num}`,
    preview: `/pool/preview/cover_${num}.jpg`,
    src: `/pool/cover_${num}.jpg`,
    type: 'image',
  }
})

const comicList = Array.from(Array(12), (v, k) => {
  let num = k + 1;
  return {
    name: `动漫 ${num}`,
    preview: `/comic/preview/cover_${num}.jpg`,
    src: `/comic/cover_${num}.jpg`,
    type: 'image',
  }
})

const dataList = [
  {
    name: "动态",
    key: "dynamic",
    list: [
      DEFAULT_COVER,
      {
        name: '樱花飞舞',
        preview: "/dynamic/sakura/preview.png",
        src: '/dynamic/sakura/index.html',
        type: 'iframe',
      },
      {
        name: '樱花少女',
        preview: "/dynamic/cover-01/preview.jpg",
        src: '/dynamic/cover-01/index.html',
        type: 'iframe',
      },
      {
        name: '点线联结',
        preview: "/dynamic/cover-02/preview.jpg",
        src: '/dynamic/cover-02/index.html',
        type: 'iframe',
      },
      {
        name: '雪花初音',
        preview: "/dynamic/cover-03/preview.jpg",
        src: '/dynamic/cover-03/index.html',
        type: 'iframe',
      },
      {
        name: '古装少女',
        preview: "/dynamic/cover-04/preview.jpg",
        src: '/dynamic/cover-04/index.html',
        type: 'iframe',
      },
      {
        name: '冲田总司樱花飘落',
        preview: "/dynamic/cover-05/preview.jpg",
        src: '/dynamic/cover-05/index.html',
        type: 'iframe',
      },
      {
        name: '冲田总司樱花飘落',
        preview: "/dynamic/cover-06/preview.png",
        src: '/dynamic/cover-06/index.html',
        type: 'iframe',
      },
      {
        name: '蕾姆樱花',
        preview: "/dynamic/cover-07/preview.jpg",
        src: '/dynamic/cover-07/index.html',
        type: 'iframe',
      },
      {
        name: '吾王 Saber',
        preview: "/dynamic/cover-08/preview.jpg",
        src: '/dynamic/cover-08/index.html',
        type: 'iframe',
      },
      {
        name: '阴阳师神乐',
        preview: "/dynamic/cover-09/preview.jpg",
        src: '/dynamic/cover-09/index.html',
        type: 'iframe',
      },
      {
        name: 'Saber Lily',
        preview: "/dynamic/cover-10/preview.jpg",
        src: '/dynamic/cover-10/index.html',
        type: 'iframe',
      },
      {
        name: '狐女',
        preview: "/dynamic/cover-11/preview.jpg",
        src: '/dynamic/cover-11/index.html',
        type: 'iframe',
      },
      {
        name: '雪之仙境',
        preview: "/dynamic/cover-12/preview.jpg",
        src: '/dynamic/cover-12/index.html',
        type: 'iframe',
      },
    ]
  },
  {
    name: "交互",
    key: "interact",
    list: [
      {
        name: '3D 立方',
        preview: "/interact/3dPhoto/preview.png",
        src: '/interact/3dPhoto/index.html',
        type: 'iframe',
      },
      {
        name: '3D 魔方',
        preview: "/interact/3dCube/preview.png",
        src: '/interact/3dCube/index.html',
        type: 'iframe',
      },
      {
        name: '科技六角',
        preview: "/interact/techHexagon/preview.png",
        src: '/interact/techHexagon/index.html',
        type: 'iframe',
      },
      {
        name: '星空之环',
        preview: "/interact/starCircle/preview.jpg",
        src: '/interact/starCircle/index.html',
        type: 'iframe',
      },
      {
        name: '3D 飞行',
        preview: "/interact/3dPlane/preview.png",
        src: '/interact/3dPlane/index.html',
        type: 'iframe',
      },
      {
        name: '火箭飞行',
        preview: "/interact/rocket/preview.png",
        src: '/interact/rocket/index.html',
        type: 'iframe',
      },
    ],
  },
  {
    name: "风景",
    key: "scenery",
    list: sceneryList,
  },
  {
    name: "淡雅",
    key: "pool",
    list: poolList,
  },
  {
    name: "星空",
    key: "star",
    list: starList,
  },
  {
    name: "动漫",
    key: "comic",
    list: comicList,
  },
  // {
  //   name: "看板娘",
  //   key: "signboard",
  //   list: [],
  // },
  {
    name: "随机",
    key: "random",
    list: [{
      name: '妹子',
      preview: COVER_HOST + "/random/meizi-preview.jpg",
      api: 'http://api.btstu.cn/sjbz/api.php?lx=meizi&format=json',
      type: 'api',
    }, {
      name: '动漫',
      preview: COVER_HOST + "/random/dongman-preview.jpg",
      api: 'http://api.btstu.cn/sjbz/api.php?lx=dongman&format=json',
      type: 'api',
    }, {
      name: 'scenery',
      preview: COVER_HOST + "/random/fengjing-preview.jpg",
      api: 'http://api.btstu.cn/sjbz/api.php?lx=fengjing&format=json',
      type: 'api',
    }, {
      name: '完全随机',
      preview: COVER_HOST + "/random/random-preview.jpg",
      api: 'http://api.btstu.cn/sjbz/api.php?format=json',
      type: 'api',
    }],
  }
]

dataList.forEach(obj => {
  if (obj.key !== 'random') {
    obj.list.forEach(cover => {
      cover.preview = COVER_HOST + cover.preview;
      cover.src = COVER_HOST + cover.src;
    })
  }
})

export default dataList;
