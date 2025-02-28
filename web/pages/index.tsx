/** Home page. */

import Icon from '@/components/Icon';
import { Pokedex } from '@/data/models/pokedex';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';

const PAGE_SIZE = 24;

export default function Home() {
  const [index, setIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(sessionStorage.getItem('pokedexIndex') || '0', 10);
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIndex = sessionStorage.getItem('pokedexIndex');
      if (storedIndex) {
        setIndex(parseInt(storedIndex, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIndex = sessionStorage.getItem('pokedexIndex');
      if (storedIndex !== index.toString()) {
        sessionStorage.setItem('pokedexIndex', index.toString());
      }
    }
  }, [index]);

  const fetchPage = async (): Promise<Pokedex> => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${index}`
    );
    const data = await response.json();
    return data;
  };

  const { data, error } = useQuery({
    queryKey: ['pokedex', index],
    queryFn: fetchPage,
    staleTime: 1000 * 60 * 5 // Cache data for 5 minutes
  });

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  const rows = data ? chunkArray(data.results) : [];

  const handlePrev = () => {
    if (index > 0) {
      setIndex((n) => n - PAGE_SIZE);
    }
  };

  const handleNext = () => {
    if (data && index < data?.count - PAGE_SIZE) {
      setIndex((n) => n + PAGE_SIZE);
    }
  };

  return (
    <div className="min-w-screen flex flex-col">
      <div className="flex justify-center items-center text-2xl font-bold space-x-80 text-black mt-8">
        <button
          onClick={handlePrev}
          className="flex m-0 space-x-0">
          <GrPrevious />
          <GrPrevious />
        </button>

        <button
          onClick={handleNext}
          className="flex m-0 space-x-0">
          <GrNext />
          <GrNext />
        </button>
      </div>

      <div className="flex justify-center w-9/10">
        <div className="">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-[1216px]">
              {row.map((pokemon, pokemonIndex) => (
                <div
                  key={pokemonIndex}
                  className="m-8 w-1/5 text-bold text-2xl font-mono text-black text-bold">
                  <Link href={`/pokemon/${pokemon.name}`}>
                    <Icon name={pokemon.name} />
                    <h1 className="text-sm">
                      {capitalizeFirstLetter(pokemon.name)}
                    </h1>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center align-center text-2xl font-bold space-x-80 text-black mb-8 bg-white">
        <button onClick={handlePrev} className="flex m-0 space-x-0 bg-white">
          <GrPrevious />
          <GrPrevious />
        </button>

        <button onClick={handleNext} className="flex m-0 space-x-0 bg-white">
          <GrNext />
          <GrNext />
        </button>
      </div>
    </div>
  );

  function capitalizeFirstLetter(val: string) {
    if (val === 'hp') {
      return 'HP';
    }

    return val
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function chunkArray<T>(array: T[]): T[][] {
    const result: T[][] = [];
    // console.log("Array" + array);
    for (let i = 0; i < PAGE_SIZE; i += 4) {
      result.push(array.slice(i, i + 4));
    }

    return result;
  }
}
