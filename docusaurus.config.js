module.exports = {
  title: 'Lin Blog',
  tagline: '程序、生活与猫',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'github', // Usually your GitHub org/user name.
  projectName: 'lin-blog', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '主页',
      logo: {
        alt: 'logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'blog',
          label: '博客',
          position: 'left',
        },
        {
          label: '前端',
          to: 'blog/tags/front',
          position: 'left',
        },
        {
          label: '后端',
          to: 'blog/tags/back',
          position: 'left',
        },
        {
          label: '相关',
          to: 'blog/tags/other',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: '文档',
          position: 'right',
        },
        {
          href: 'https://github.com/xiaominglin789/lin-blog',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '关联',
          items: [
            {
              label: '博客',
              to: 'blog/',
            },
            {
              label: '文档',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: '联系',
          items: [
            {
              label: '微信',
              href: '#',
            },
            {
              label: 'qq邮箱: 319284737@qq.com',
              href: 'https://email.qq.com',
            },
            {
              label: 'gmail: xiaominglin789@gmail.com',
              href: 'https://mail.google.com',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/xiaominglin789',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lin Blog, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/xiaominglin789/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/xiaominglin789/lin-blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
