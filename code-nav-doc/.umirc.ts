import {defineConfig} from 'dumi';

export default defineConfig({
  title: '编程导航',
  favicon: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/logo.png',
  logo: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/logo.png',
  outputPath: 'docs-dist',
  mode: 'site',
  analytics: {
    baidu: 'eb44917eec45fb8f09c3ae111c5e62bc',
  },
  metas: [
    {
      name: 'keywords',
      content: '编程,程序员,导航,编程资源,自学编程,编程导航,编程学习'
    },
    {
      name: 'description',
      content: '编程导航文档,最专业的程序员导航网站,发现优质编程学习资源,定制你的程序员必备主页,公众号编程导航'
    },
  ],
});
