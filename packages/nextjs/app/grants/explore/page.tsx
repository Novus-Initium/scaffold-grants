"use client";

import Head from "next/head";
import Link from "next/link";

const GrantsExplorePage = () => {
  return (
    <div className="glass min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <Head>
        <title>Grant Rounds</title>
      </Head>
      <div className="card bg-accent-content shadow-md px-10 mb-2 rounded-md p-10 max-w-lg w-full items-center text-center">
        <h1 className="text-3xl font-extrabold mb-8 text-info">Explore Rounds</h1>
        <div>
          <Link href="/grants/explore/active" passHref>
            <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-300 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              View Active
            </button>
          </Link>
          <Link href="/grants/explore/future" passHref>
            <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-300 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              View Upcoming
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GrantsExplorePage;
