import { defaultTheme } from 'vuepress';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';

export default {
    base: '/cxmooc-tools/',
    lang: 'zh-CN',
    title: '超星慕课小工具',
    description: '一个 大学生网课 学习工具,Edge,谷歌,油猴支持.全自动任务,视频倍速秒过,作业考试题库(੧ᐛ੭挂科模式,启动)',
    theme: defaultTheme({
        colorMode: 'auto',
        colorModeSwitch: true,
        home: '/',
        navbar: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: '使用教程',
                children: [
                    { text: '简介', link: '/1-UserGuide/' },
                    { text: '打包版浏览器(小白看我)', link: '/1-UserGuide/1-7-easychorme.md' },
                    { text: 'FireFox 扩展', link: '/1-UserGuide/1-2-firefox.html' },
                    { text: 'Chrome 扩展', link: '/1-UserGuide/1-1-chrome.html' },
                    { text: 'Tampermonkey 脚本', link: '/1-UserGuide/1-3-tampermonkey.html' },
                    // {text: '中国大学mooc专用', link: '/1-UserGuide/1-8-moocchorme.html'},
                    { text: '常见问题【使用必看】', link: '/1-UserGuide/qa.md' },
                    { text: '功能说明', link: '/1-UserGuide/featured.html' },
                    { text: '配置说明', link: '/1-UserGuide/1-4-config.html' },
                ]
            },
            {
                text: '开发文档',
                link: '/Develop/',
            },
            {
                text: '免责声明',
                link: '/3-Disclaimer/',
            },
            {
                text: '语言选项',
                children: [
                    { text: '简体中文', link: '/' },
                    { text: 'English', link: '/en-us/' }
                ]
            },
            //{ text: 'Github', link: 'https://github.com/chettoy/cxmooc-tools' },
        ],
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'chettoy/cxmooc-tools',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: 'GitHub',
        // sidebar: 'auto',
        sidebar: {
            '/1-UserGuide/': [
                {
                    text: '简介',
                    children: [
                        '',
                        'qa.html',
                        '1-6-gettoken.html',
                        '1-7-easychorme.html',
                        // '1-8-moocchorme.html',
                        '1-2-firefox.html',  /* /foo/one.html */
                        '1-1-chrome.html',
                        '1-3-tampermonkey.html',     /* /foo/ */
                        '1-5-otherchorme.html',
                        'featured.html',//功能说明
                        '1-4-config.html',//配置说明
                    ],
                },
            ],
            '/Develop/': [
                {
                    text: '开发文档',
                    children: [
                        '',
                        'Component.html',
                        'Platform.html',
                        'QuestionBank.html',
                        'Utils.html',
                    ],
                },
            ],
        },
        editLink: true,
        // 默认为 "Edit this page"
        editLinkText: '在 GitHub 上编辑此页',
        docsBranch: 'main',
        docsDir: 'docs',
        lastUpdated: true,
        lastUpdatedText: 'Last Updated',
    }),
    plugins: [
        backToTopPlugin(),
        // googleAnalyticsPlugin({
        //     id: 'G-XXXXXXXXXX',
        // }),
    ],
};