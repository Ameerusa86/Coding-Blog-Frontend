"use client";

import React, { useEffect, useState, useRef } from "react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Import PrismJS theme
import "prismjs/components/prism-javascript"; // Add languages as needed
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import CopyButton from "@/components/CopyButton"; // Ensure this path is correct
import { db } from "@/lib/firebase";

interface BlogProps {
  params: {
    slug: string;
  };
}

const BlogDetailsPage: React.FC<BlogProps> = ({ params }) => {
  const { slug } = params;
  const [blog, setBlog] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const codeElements = useRef<React.RefObject<HTMLPreElement>[]>(
    Array.from({ length: 10 }, () => React.createRef())
  ); // Array to store code element refs

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

  useEffect(() => {
    if (blog) {
      Prism.highlightAll(); // Highlight all code blocks
    }
  }, [blog]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-10 px-4">
      <section className="mb-20 mt-10">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-slideInFromLeft">
          {blog?.title}
        </h1>
        {blog?.image && (
          <div className="w-full h-[500px] relative mb-6 rounded-xl overflow-hidden shadow-lg animate-fadeIn bg-contain">
            <Image
              src={blog?.image}
              alt={blog?.title}
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <p className="text-xl mb-6 animate-slideInFromLeft delay-100">
          By: <span className="font-semibold">{blog?.author}</span>
        </p>
        <div
          className="prose lg:prose-xl max-w-none mb-6 animate-slideInFromLeft delay-200"
          dangerouslySetInnerHTML={{ __html: blog?.description }}
        ></div>
        <div className="prose lg:prose-xl max-w-none animate-slideInFromLeft delay-300 space-y-6">
          {blog?.body && (
            <div dangerouslySetInnerHTML={{ __html: blog?.body }} />
          )}
          {Array.from(
            new DOMParser()
              .parseFromString(blog?.body || "", "text/html")
              .querySelectorAll("pre code")
          ).map((codeElement, index) => (
            <div key={index} className="relative">
              <CopyButton
                targetElement={codeElements.current[index]} // Pass ref to CopyButton
                textToCopy={codeElement.textContent || ""}
              />
              <pre className="relative">
                <code
                  id={`code-block-${index}`}
                  className={codeElement.className}
                  dangerouslySetInnerHTML={{ __html: codeElement.innerHTML }}
                ></code>
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetailsPage;
