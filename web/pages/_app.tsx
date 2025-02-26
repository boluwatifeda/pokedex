/**
 * Entry point for the Next application. All components that
 * are rendered by Next are rendered through this file, taking
 * place of the <Component> tag in the return statement.
 */

import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdCatchingPokemon } from "react-icons/md";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPokemonPage = router.isReady && typeof router.query.pokemon === "string";

  return (
    <QueryClientProvider client={ queryClient }>
      <div className={`flex ${ isPokemonPage ? "bg-white" : "bg-black" } w-screen h-20 justify-center items-center top-0 fixed`}>
        <Link href="/">
          <MdCatchingPokemon className={`transition-colors duration-500 ease-in-out size-20 hover:text-[#FF0000] ${ isPokemonPage ? "text-black" : ""}`}/>
        </Link>
      </div>

      <div className={`pt-20 ${ isPokemonPage ? "bg-black" : "bg-white"}`}>
        <Component {...pageProps}/>
      </div>
      

    </QueryClientProvider>
  );
}
