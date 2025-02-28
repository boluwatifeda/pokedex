import { useState, useEffect } from 'react';
import Image from 'next/image';

type IconProps = { name: string };

export default function Icon({ name }: IconProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const data = await response.json();
        const image = data.sprites.front_default;
        setImage(image);
      } catch (e) {
        console.log('Failed to fetch Pokémon image', e);
      }
    };

    fetchImage();
  }, [name]);

  if (!image)
    return (
      <div className="flex items-center justify-center p-2 bg-slate-300 rounded-md w-60 h-60 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.25)] text-center text-gray-500">
        Image Unavailable
      </div>
    );

  return (
    <div className="flex items-center justify-center p-2 bg-slate-300 rounded-md w-60 h-60 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.25)]">
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="object-contain items-center"
      />
    </div>
  );
}
