'use client'; // Required to use the useRouter hook for client-side navigation

import { useRouter } from 'next/navigation';

export default function AlternatePage() {
  // Initialize the router to handle navigation actions
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          This is just alternate page
        </p>
      </div>

      <div className="mt-8">
        {/* 
          A button styled to match the default Next.js interactive elements.
          It uses the browser's history to return to the previous URL.
        */}
        <button
          onClick={() => router.back()}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`text-2xl font-semibold`}>
            U can go back{" "}
            <span className="inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
              &lt;-
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Click here to return to the initial page.
          </p>
        </button>
      </div>
    </main>
  );
}