"use client";

import Head from "next/head";
import Link from "next/link";

const ProjectsPage = () => {
  return (
    <div className="glass min-h-screen py-10 bg-base-100 flex flex-col items-center justify-center">
      <Head>
        <title>Grant Rounds</title>
      </Head>
      <div className="card bg-accent-content px-10 mb-2 max-w-lg shadow-xl">
        <div className="card-body flex items-center text-center ">
          <h1 className="card-title text-3xl font-extrabold text-primary py-4">Rounds</h1>
          <div className="card-actions flex-col items-center rounded-md mb-2">
            <Link href="/grants/create" passHref>
              <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-200 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Create a Grant Round
              </button>
            </Link>
            <Link href="/grants/manage" passHref>
              <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-200 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Manage Your Grant Rounds
              </button>
            </Link>
            <Link href="/grants/explore" passHref>
              <button className="w-full mb-6 py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-base-content bg-base-200 hover:bg-primary hover:shadow-xl focus:outline-white focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
                Explore Grant Rounds
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
