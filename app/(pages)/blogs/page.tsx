"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { db } from "@/lib/firebase"; // Import the Firestore instance from your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods for fetching documents

// Define a TypeScript interface for the Blog object
interface Blog {
  title: string;
  description: string;
  id: string;
  author: string;
  image: string;
  slug: string;
}

const BlogsPage = () => {
  // State to store the list of blogs
  const [blogs, setBlogs] = useState<Blog[]>([]);
  // State to manage the loading state
  const [loading, setLoading] = useState(true);
  // State to manage any error that occurs during the fetch operation
  const [error, setError] = useState<null | string>(null);

  // useEffect hook to fetch the blog data from Firestore when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Reference to the "blogs" collection in Firestore
        const blogsCollection = collection(db, "blogs");
        // Fetch all documents from the "blogs" collection
        const blogSnapshot = await getDocs(blogsCollection);
        // Map through the fetched documents and format them as Blog objects
        const blogList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[];
        // Update the blogs state with the fetched blog data
        setBlogs(blogList);
      } catch (err) {
        // If an error occurs, set the error state
        setError("Failed to fetch blogs");
      } finally {
        // Set the loading state to false once the fetch operation is complete
        setLoading(false);
      }
    };

    // Call the fetchBlogs function to initiate data fetching
    fetchBlogs();
  }, []); // Empty dependency array means this effect runs once on component mount

  // If the data is still loading, display a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If an error occurred, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // Render the blogs once data is fetched successfully
  return (
    <div className="max-container mb-10">
      <section className="max-container padding-container mb-20 mt-10">
        <h1 className="bold-40 lg:bold-40">Coding Blog</h1>
      </section>
      <div className="flex gap-5">
        {/* Map through the blogs and render a Card component for each blog */}
        {blogs.map((blog) => (
          <Card
            key={blog.id} // Unique key for each blog item
            title={blog.title}
            description={blog.description}
            author={blog.author}
            image={blog.image}
            slug={blog.slug} // Pass slug if necessary for navigation
          />
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
