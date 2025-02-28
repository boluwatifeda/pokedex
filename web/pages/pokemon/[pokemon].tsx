import { Pokemon } from '@/data/models/pokemon';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { typeToColor } from '@/components/Typing';
import { PokemonSpecies } from '@/data/models/pokemon-species';
import { formatFlavorText } from '@/utils/flavor-text-formatter';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

interface PokemonPageProps {
  pokemonData: Pokemon;
  speciesData: PokemonSpecies;
  devolutionData: Pokemon | null;
}

export default function PokemonPage({
  pokemonData,
  speciesData,
  devolutionData
}: PokemonPageProps) {
  const router = useRouter();

  const image = pokemonData?.sprites.front_default;
  const moves = pokemonData?.moves;
  const stats = pokemonData?.stats;
  const types = pokemonData?.types;

  return (
    <div className="bg-[#444444] w-screen min-h-screen flex justify-center">
      <div className="w-[90%] flex justify-center bg-[#333333]">
        <div className="w-1/2 flex flex-col items-center mt-10">
          <div className="flex flex-col">
            {image && (
              <div className="flex flex-col justify-center items-center bg-slate-200 w-[500px] h-[500px] m-10 rounded-md">
                <Image
                  src={image}
                  alt={pokemonData?.name ?? 'Image Unavailable'}
                  width={400}
                  height={400}
                />
                <h1 className="text-[#CC0000] font-mono font-medium pl-1 pr-1">
                  {capitalizeFirstLetter(pokemonData?.name)}
                </h1>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center mt-4">
            <h1 className="text-white flex justify-center font-mono font-semibold text-2xl mt-3 items-center">
              MOVES
            </h1>
            <div className="grid grid-cols-5 gap-2 max-w-[600px] m-5 mt-3 justify-center">
              {moves &&
                moves.map((move, index) => (
                  <Link key={index} href={`../move/${move.move.name}`}>
                    <div className="bg-slate-300 text-black text-center font-mono text-xs pl-1 pr-1 flex flex-col justify-center items-center rounded-sm hover:bg-[#CC0000] hover:text-white shadow[inset_4px_4px_10px_rgba(0,0,0,0.25)] h-full w-full">
                      {capitalizeFirstLetter(move.move.name)}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="flex w-1/2 mt-10 justify-center">
          <div className="w-4/5">
            <div className="flex flex-col m-10 justify-center bg-slate-200 rounded-md border-dotted">
              <div className="m-5">
                <h1 className="text-[#CC0000] font-mono font-bold flex justify-center mb-3">
                  Type(s)
                </h1>
                <div className="flex flex-col justify-center">
                  {types &&
                    types.map((t, index) => (
                      <p
                        key={index}
                        className="flex flex-col justify-center text-center font-mono font-semibold"
                        style={{ color: typeToColor[t.type.name] }}>
                        {capitalizeFirstLetter(t.type.name)}
                      </p>
                    ))}
                </div>
              </div>

              <div className="m-5 mt-4">
                <h1 className="text-[#CC0000] font-mono font-bold flex justify-center mb-3">
                  Base Stats
                </h1>
                {stats &&
                  stats.map((stat, index) => (
                    <p
                      key={index}
                      className="text-black font-mono flex justify-center">
                      {capitalizeFirstLetter(stat.stat.name)}:{' '}
                      {stat.base_stat}{' '}
                    </p>
                  ))}
              </div>

              <div className="m-5 mt-4">
                <h1 className="text-[#CC0000] font-mono font-bold flex justify-center mb-3">
                  Legendary
                </h1>
                {pokemonData && (
                  <p className="text-black flex justify-center items-center font-mono">
                    {capitalizeFirstLetter(pokemonData?.name)} is{' '}
                    {speciesData?.is_legendary ? '' : 'not '}a legendary.
                  </p>
                )}
              </div>

              <div className="m-5 mt-4">
                <h1 className="text-[#CC0000] font-mono font-bold flex justify-center mb-3">
                  Mythical
                </h1>
                {pokemonData && (
                  <p className="text-black flex justify-center items-center font-mono">
                    {capitalizeFirstLetter(pokemonData?.name)} is{' '}
                    {speciesData?.is_mythical ? '' : 'not '}a mythical.
                  </p>
                )}
              </div>

              <div className="m-5 mt-4 flex flex-col justify-center">
                <h1 className="text-[#CC0000] font-mono font-bold flex justify-center mb-3">
                  Background
                </h1>
                {speciesData?.flavor_text_entries && (
                  <p className="text-black text-center font-mono">
                    {formatFlavorText(
                      speciesData.flavor_text_entries.find(
                        (entry) => entry.language.name === 'en'
                      )?.flavor_text || 'No background available.'
                    )}
                  </p>
                )}
              </div>

              <div className="m-5 mt-4 flex flex-col justify-center items-center">
                <h1 className="text-[#CC0000] font-mono font-bold flex justify-center mb-3">
                  Evolved From
                </h1>
                {devolutionData?.sprites ? (
                  <Link href={`./${devolutionData.name}`}>
                    <Image
                      src={devolutionData.sprites.front_default}
                      alt={devolutionData.name ?? 'Base evolution'}
                      width={200}
                      height={200}
                    />
                  </Link>
                ) : (
                  <Link href={`./${router.query.pokemon}`}>
                    {pokemonData?.sprites?.front_default ? (
                      <Image
                        src={pokemonData?.sprites.front_default}
                        alt={pokemonData?.name ?? 'Base evolution'}
                        width={200}
                        height={200}
                      />
                    ) : (
                      <p>Image not available</p>
                    )}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pokemon } = context.query;

  const [pokemonResponse, speciesResponse] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
  ]);

  const pokemonData = pokemonResponse.ok
    ? ((await pokemonResponse.json()) as Pokemon)
    : null;
  const speciesData = speciesResponse.ok
    ? ((await speciesResponse.json()) as PokemonSpecies)
    : null;

  const devolutionData = speciesData?.evolves_from_species
    ? await fetch(
        `https://pokeapi.co/api/v2/pokemon/${speciesData.evolves_from_species.name}`
      ).then((res) => res.json())
    : null;

  return {
    props: {
      pokemonData,
      speciesData,
      devolutionData
    }
  };
};
