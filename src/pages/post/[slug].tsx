/* eslint-disable react/no-danger */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Comments from '../../components/Comments';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
  reading_time: number;
}

interface PostProps {
  post: Post;
  preview: boolean;
}

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacestraveling</title>
      </Head>

      <Header />

      <div className={styles.imageBanner}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>

          <div className={styles.infoContent}>
            <time>
              <FiCalendar />{' '}
              {format(new Date(post.first_publication_date), 'PP', {
                locale: ptBR,
              })}
            </time>

            <span className={styles.infoAuthor}>
              <FiUser /> {post.data.author}
            </span>

            <span className={styles.infoReadTime}>
              <FiClock /> {post.reading_time} min
            </span>

            {post.last_publication_date !== post.first_publication_date && (
              <span className={styles.infoLastEdition}>
                *editado em{' '}
                {format(new Date(post.last_publication_date), 'PP', {
                  locale: ptBR,
                })}
                , às{' '}
                {format(new Date(post.last_publication_date), 'H:m', {
                  locale: ptBR,
                })}
              </span>
            )}
          </div>

          <div className={styles.content}>
            {post.data.content.map(item => (
              <div key={item.heading}>
                <header>{item.heading}</header>
                <div dangerouslySetInnerHTML={{ __html: item.body }} />
              </div>
            ))}
          </div>
        </article>

        <Comments />

        {preview && (
          <aside className={styles.leavePreview}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({
  params,
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();

  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});

  const reading_time = response.data.content.reduce((acc, content) => {
    const body = RichText.asText(content.body);
    const split = body.split(' ');
    const words_amount = split.length;

    const result = Math.ceil(words_amount / 200);

    return acc + result;
  }, 0);

  const post = {
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,

      content: response.data.content.map(item => {
        item.body = RichText.asHtml(item.body);
        return item;
      }),
    },
    reading_time,
  };

  // console.log(JSON.stringify(response.data.content.heading), null, 2);
  // console.log(response.data.content);

  return {
    props: { post, preview },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
