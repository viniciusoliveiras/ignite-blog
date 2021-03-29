import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

// interface Post {
//   uid?: string;
//   first_publication_date: string | null;
//   data: {
//     title: string;
//     subtitle: string;
//     author: string;
//   };
// }

// interface PostPagination {
//   next_page: string;
//   results: Post[];
// }

// interface HomeProps {
//   postsPagination: PostPagination;
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home() {
  return (
    <>
      <Head>
        <title>home | blog</title>
      </Head>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    { fetch: ['publication.title', 'publication.content'], pageSize: 20 }
  );

  // console.log(JSON.stringify(postsResponse, null, 2));

  // const posts = postsResponse.results.map(post => {
  //   return {
  //     slug: post.uid,
  //     title: post.data.title,
  //   };
  // });

  return {
    props: {},
  };
};
