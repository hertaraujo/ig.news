import { GetStaticProps } from "next";
import Head from "next/head";

import { getPrismicClient } from "../../services/prismic";
import * as prismicHelpers from "@prismicio/helpers";

import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews </title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <a href="#" key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getAllByType("post", {
    fetchLinks: ["post.title", "post.content"],
    pageSize: 100,
  });

  const posts = response.map(post => {
    return {
      slug: post.id,
      title: prismicHelpers.asText(post.data.title),
      excerpt:
        post.data.content.find(content => content.type === "paragraph")?.text ??
        "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: { posts },
  };
};
