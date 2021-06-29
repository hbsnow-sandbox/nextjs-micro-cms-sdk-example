import React from "react";

import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";

import { BlogListResponse } from "../types/blog";
import { SiteDataResponse } from "../types/siteData";
import { client } from "../utils/api";

type StaticProps = {
  siteData: SiteDataResponse;
  blogList: BlogListResponse;
};
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Page: NextPage<PageProps> = (props) => {
  const { siteData, blogList } = props;

  return (
    <main>
      <h1>{siteData.title}</h1>
      <section>
        <h2>ブログ一覧</h2>
        <ul>
          {blogList.contents.map((blog) => (
            <li key={blog.id}>
              <Link href={`/blogs/${blog.id}`}>
                <a>{blog.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const siteDataPromise = client.get<SiteDataResponse>({
    endpoint: "sitedata",
    queries: { fields: "title" },
  });

  const blogListPromise = client.get<BlogListResponse>({
    endpoint: "blogs",
    queries: { fields: "id,title" },
  });

  const [siteData, blogList] = await Promise.all([
    siteDataPromise,
    blogListPromise,
  ]);

  return {
    props: {
      siteData,
      blogList,
    },
    revalidate: 60,
  };
};

export default Page;
