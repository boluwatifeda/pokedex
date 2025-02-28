import { typeToColor } from '@/components/Typing';
import { Move } from '@/data/models/move';
import { formatFlavorText } from '@/utils/flavor-text-formatter';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface MoveProps {
  moveData: Move;
}

export default function MovePage({ moveData }: MoveProps) {
  const router = useRouter();

  return (
    <div className="bg-[#444444] flex justify-center items-center h-[calc(100vh-80px)] overflow-hidden">
      <button
        className="bg-[#CC0000] text-white font-semibold font-mono text-md rounded-md pl-2 pr-2 absolute left-1 top-2 m-10 translate-y-20 border-3 border[#CC0000] border-double"
        onClick={() => {
          router.back();
        }}>
        Return
      </button>
      <div className="flex flex-col justify-center items-center bg-slate-200 w-1/2 h-1/2 p-5 rounded-md border-[#CC0000] border-2 border-double">
        <h1
          className="font-mono flex justify-center font-semibold text-4xl"
          style={{ color: typeToColor[moveData.type.name] }}>
          {capitalizeFirstLetter(moveData.name)}
        </h1>
        <div className="font-mono text-black flex flex-col items-center m-8">
          <p>
            Accuracy:{' '}
            {moveData.accuracy ? moveData.accuracy + '' : 'Not Applicable'}
          </p>
          <p>Power: {moveData.power ? moveData.power : 'Not Applicable'}</p>
          <p>PP: {moveData.pp}</p>
          <p style={{ color: typeToColor[moveData.type.name] }}>
            Type: {capitalizeFirstLetter(moveData.type.name)}
          </p>
          <p>
            Damage Class: {capitalizeFirstLetter(moveData.damage_class.name)}
          </p>
        </div>
        <p className="text-black text-center font-mono mt-5">
          {formatFlavorText(
            moveData.flavor_text_entries.find(
              (entry) => entry.language.name === 'en'
            )?.flavor_text || 'No background available.'
          )}
        </p>
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
  const { move } = context.query;

  const moveResponse = await fetch(`https://pokeapi.co/api/v2/move/${move}`);
  const moveData = moveResponse.ok
    ? ((await moveResponse.json()) as Move)
    : null;

  return {
    props: {
      moveData
    }
  };
};
