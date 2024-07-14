"use client";

import { db } from "@/lib/firebase";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface BlogProps {
  params: {
    slug: string;
  };
}

const BlogDetailsPage = ({ params }: BlogProps) => {
  const { slug } = params;
  const [blog, setBlog] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await getDoc(doc(db, "blogs", slug));
        if (blogDoc.exists()) {
          setBlog(blogDoc.data());
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        setError("Failed to fetch blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-container mb-10">
      <section className="max-container padding-container mb-20 mt-10">
        <h1 className="bold-52 lg:bold-88">{blog?.title}</h1>
        <Image
          src={blog?.image}
          alt={blog?.title}
          className="w-[500px] h-[500px] bg-cover rounded-xl"
          height={1000}
          width={1000}
        />
        <p>By: {blog?.author}</p>
        <div dangerouslySetInnerHTML={{ __html: blog?.description }}></div>
        <div dangerouslySetInnerHTML={{ __html: blog?.body }}></div>
      </section>
    </div>
  );
};

export default BlogDetailsPage;
