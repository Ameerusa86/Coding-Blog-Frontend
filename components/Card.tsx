import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";

interface Blog {
  title: string;
  description: string;
  slug: string;
  author: string;
  image: string;
}

const Card = ({
  description,
  title,
  author,
  image,
  slug,
}: {
  description: string;
  title: string;
  author: string;
  image: string;
  slug: string;
}): ReactElement => {
  return (
    <div className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md mb-20">
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
        <Image src={image} alt={title} height={1000} width={1000} />
      </div>
      <div className="p-6">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          {title}
        </h5>
        <p
          dangerouslySetInnerHTML={{ __html: description }}
          className="block font-sans text-base font-light leading-relaxed text-inherit antialiased"
        ></p>
        <p className="block font-sans text-bold leading-relaxed text-inherit antialiased mt-5">
          By: {author}
        </p>
      </div>
      <div className="p-6 pt-0">
        <Link href={`/blogs/${slug}`}>
          <button
            data-ripple-light="true"
            type="button"
            className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
