import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function mapPostIndex(post): Post {
  return {
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  };
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  async function handleLoadMore() {
    const response = await fetch(postsPagination.next_page);
    const responseData: ApiSearchResponse = await response.json();

    const postsLoaded = responseData.results.map(mapPostIndex);

    setNextPage(responseData.next_page);
    setPosts([...posts, ...postsLoaded]);
  }

  return (
    <>
      <Head>
        <title>home | blog</title>
      </Head>

      <Header />

      <main className={commonStyles.container}>
        {posts.map(post => (
          <div className={styles.postContainer} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.infos}>
                  <time>
                    <FiCalendar />{' '}
                    {format(new Date(post.first_publication_date), 'PP', {
                      locale: ptBR,
                    })}
                  </time>
                  <span>
                    <FiUser /> {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        ))}

        {nextPage && (
          <button
            type="button"
            className={styles.loadMore}
            onClick={handleLoadMore}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    { fetch: ['post.title', 'post.subtile', 'post.author'], pageSize: 1 }
  );

  // console.log(JSON.stringify(postsResponse, null, 2));

  const posts: Post[] = postsResponse.results.map(mapPostIndex);

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
    redirect: 60 * 30,
  };
};
