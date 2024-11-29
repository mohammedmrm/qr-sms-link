import Footer from './footer';
import Headers from './header';
import Sidebar from './sidebar';

export default function Template({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div className={'flex  h-screen'}>
      <div className={`fixed z-50 shadow-md  bg-green-100 w-full px-0`}>
        <Headers />
      </div>
      <Sidebar />
      <main className="w-full md:h-screen flex mt-8  bg-white">
        <div className="  w-full">{children}</div>
      </main>
      <div className={`fixed z-50 shadow-md text-slate-50 bg-gray-900 w-full bottom-0`}>
        <Footer />
      </div>
    </div>
  );
}
