import {defineConfig} from 'dumi';

export default defineConfig({
  title: '编程导航',
  favicon: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/1610990261129-favicon.png',
  logo: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/1610990216593-logo.3c8859f8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  analytics: {
    baidu: 'eb44917eec45fb8f09c3ae111c5e62bc',
  },
  metas: [
    {
      name: 'keywords',
      content: '编程,程序员,导航,资源,主页,编程导航'
    },
    {
      name: 'description',
      content: '编程导航,文档,最专业的程序员导航网站,发现优质编程学习资源,定制你的程序员必备主页,公众号编程导航'
    },
  ],
});
