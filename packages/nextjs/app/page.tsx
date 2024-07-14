"use client";

import Head from 'next/head';
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { DocumentMagnifyingGlassIcon, PlusCircleIcon, BanknotesIcon, UserGroupIcon, BuildingLibraryIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="glass flex items-center flex-col flex-grow pt-3 bg-secondary-100">
        <Head>
          <title>Home</title>
        </Head>
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-3xl mb-2 secondary-100">Nouns Grant Stack</span>
            <span className="block text-2xl text-secondary-200 font-bold">
              <div class="avatar">
                <div class="w-6 rounded"><img src="/favicon.png"/>
                </div>
              </div> Fund A Noun and Find Out  
              <div class="avatar">
                <div class="w-6 rounded"><img src="IMPslogo.svg"/>
                </div>
              </div>
            </span>
          </h1>
        </div>
        <div className="flex-grow w-full mt-2 px-8 py-6">
          <div className="flex justify-center items-center gap-6 flex-col sm:flex-row">
            <div className="flex items-center card bg-base-100 w-42 hover:bg-secondary hover:shadow transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              <div className="card-body items-center">
                <Link href="/projects" passHref className="link">
                  <h1 className="card-title text-2xl mb-2 bold">Projects</h1>
                </Link>
                <UserGroupIcon className="h-8 w-8 fill-accent-content" />
                <p>
                  <b>Create</b> a Mission.
                </p>
                <p>
                  <b>Manage</b> a Mission.
                </p>
                <p>
                  <b>Explore</b> current Projects.{" "}
                </p>
                <div className="card-actions">
                  <ul className="flex flex-row menu menu-horizontal bg-base-200 rounded-box mt-6">
                    <li>
                      <a href="/projects/create" className="tooltip" data-tip="Create">
                        <PlusCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/projects/manage" className="tooltip" data-tip="Manage">
                        <BuildingLibraryIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/projects/explore" className="tooltip" data-tip="Explore">
                        <MagnifyingGlassCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center card bg-base-100 w-42 hover:shadow-x1 hover:bg-secondary hover:shadow transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0">
              <div className="card-body items-center">
                <Link href="/grants" passHref className="link">
                  <h1 className="card-title text-2xl mb-2 bold">Rounds</h1>
                </Link>
                <BanknotesIcon className="h-8 w-8 fill-accent-content" />
                <p>
                  <b>Create</b> a Grant Round.
                </p>
                <p>
                  <b>Manage</b> a Round.
                </p>
                <p>
                  <b>Explore</b> live Rounds.{" "}
                </p>
                <div className="card-actions">
                  <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">
                    <li>
                      <a href="/grants/create" className="tooltip" data-tip="Create">
                        <PlusCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/grants/manage" className="tooltip" data-tip="Manage">
                        <BuildingLibraryIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                    <li>
                      <a href="/grants/explore" className="tooltip" data-tip="Explore">
                        <MagnifyingGlassCircleIcon className="h-8 w-8 fill-accent-content" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
