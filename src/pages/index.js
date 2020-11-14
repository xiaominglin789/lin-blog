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
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604986666206&di=593728b635cbe15af37066206388e347&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F15%2F20200315170821_4VTj3.thumb.400_0.gif"></img>
      </>
    ),
  },
  {
    title: '猫',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604987275210&di=41db7e2ae994fee6b628d98189e502c6&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201808%2F21%2F20180821092739_tRwUZ.thumb.700_0.gif"></img>
      </>
    ),
  },
  {
    title: '生活',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604985970298&di=13cba79306929239772783fa36ef6223&imgtype=0&src=http%3A%2F%2F08imgmini.eastday.com%2Fmobile%2F20191027%2F20191027231946_f469fc159669a5abd2469a7aaff897d8_4.gif"></img>
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
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
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
              to={useBaseUrl('blog/')}>
              查看博客
            </Link>
          </div>
        </div>
      </header>
      <main>
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
  );
}

export default Home;
