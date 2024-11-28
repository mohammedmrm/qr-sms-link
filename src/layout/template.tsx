import * as React from 'react';
import Sidebar from './sidebar';
import Headers from './header';

export default function Template({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div className={'flex  h-screen'}>
      <div>
        <Headers />
      </div>
      <Sidebar />
      <main className="w-full md:h-screen flex  bg-white">
        <div className="  w-full">{children}</div>
      </main>
    </div>
  );
}
