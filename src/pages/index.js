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
        {/*https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604985970298&di=13cba79306929239772783fa36ef6223&imgtype=0&src=http%3A%2F%2F08imgmini.eastday.com%2Fmobile%2F20191027%2F20191027231946_f469fc159669a5abd2469a7aaff897d8_4.gif*/}
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608113235265&di=68add62afd52830943a1786c4fe6a232&imgtype=0&src=http%3A%2F%2Fwww.17qq.com%2Fimg_biaoqing%2F74400177.jpeg"></img>
      </>
    ),
  },
  {
    title: '我是舔狗? 喵~',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608113235298&di=682a4040e83412f4eb37e08ed216c4f9&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F21%2F20190121043748_hdooq.thumb.400_0.gif"></img>
      </>
    ),
  },
  {
    title: '放我过去!',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608113235299&di=e705623b8178bb114dff709a01b09759&imgtype=0&src=http%3A%2F%2Fww2.sinaimg.cn%2Flarge%2F85cc5ccbgy1ffngdgcowag208c0cckjl.jpg"></img>
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
            <h3>前端</h3>
            <div>1.javascript 基础巩固</div>
            <div>2.typescript 上手</div>
            <div>3.前端框架练手：vue 、angulur、react</div>
            <div>4.nest.js 项目练习</div>
          </div>
          <div>
            <h3>后端 </h3>
            <div>1.java 基础学习</div>
            <div>2.mysql 练习</div>
            <div>3.redis 练习</div>
            <div>4.spring boot 项目练习</div>
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
