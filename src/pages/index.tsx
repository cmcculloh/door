import Head from 'next/head'
import Article from '../components/Article';

import { getDailyReadings } from '../lib/readings';

type post = {
  title: string;
  date: string;
  text: string;
  source: string;
}

type data = {
  posts: post[];
}

type Props = {
  data: data;
}

export async function getStaticProps() {
  const data = await getDailyReadings();
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  return (
    <>
      <Head>
        <title>Daily Readings</title>
        <meta name="description" content="Daily Readings in the Orthodox Church" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {data.posts.map((post: post, index: number) => (
          <Article
            key={index}
            title={post.title}
            date={post.date}
            content={post.text}
            source={post.source}
          />
        ))}

      </main>
    </>
  )
}
