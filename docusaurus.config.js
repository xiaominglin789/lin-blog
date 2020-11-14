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
          to: 'docs/',
          activeBasePath: 'docs',
          label: '其他',
          position: 'right',
        },
        { to: 'blog', label: '博客', position: 'left' },
        {
          href: 'https://github.com/apem789/lin-blog',
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
              label: '其他',
              to: 'docs/',
            },
            {
              label: '无关',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: '联系',
          items: [
            {
              label: '微信',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: '邮箱',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/apem789',
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
              href: 'https://github.com/apem789',
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
          editUrl: 'https://github.com/apem789/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/apem789/lin-blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
