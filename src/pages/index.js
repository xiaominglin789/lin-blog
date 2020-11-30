import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/** tab栏内容 */
const features = [
  {
    title: '程序员',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        {/* <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604986666206&di=593728b635cbe15af37066206388e347&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F15%2F20200315170821_4VTj3.thumb.400_0.gif"></img> */}
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604985970298&di=13cba79306929239772783fa36ef6223&imgtype=0&src=http%3A%2F%2F08imgmini.eastday.com%2Fmobile%2F20191027%2F20191027231946_f469fc159669a5abd2469a7aaff897d8_4.gif"></img>
        {/* <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606723906489&di=129b366815c48e877304062a95a14468&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn17%2F503%2Fw250h253%2F20180403%2F515d-fysuuya1261512.gif"></img> */}
      </>
    ),
  },
  {
    title: '猫狗大战(Cat and dog war)',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        <img src="http://pic.ik123.com/uploads/allimg/180723/12-1PH3145639.gif"></img>
      </>
    ),
  },
  {
    title: '猫虾大战(Cat and shrimp war)',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        <img src="http://pic.ik123.com/uploads/allimg/180723/12-1PH3145641.gif"></img>
      </>
    ),
  },
]

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  console.log(context)
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      {/* header */}
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('blog/')}
            >
              查看博客
            </Link>
          </div>
        </div>
      </header>
      {/* 当前在干嘛,未来计划 */}
      <main>
        <div className={styles.reports}>
          <div>
            <h3>未来: </h3>
            <div>2021-02-10 js设计模式</div>
            <div>2021-02-20 js数据结构与算法</div>
            <div>2021-02-27 node.js知识巩固</div>
          </div>
          <div>
            <h3>最近在折腾: </h3>
            <div>2020-12-18 html+css 练习</div>
            <div>2080-12-12 js基础巩固</div>
            <div>2080-12-07 js基础巩固</div>
          </div>
        </div>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default Home;
