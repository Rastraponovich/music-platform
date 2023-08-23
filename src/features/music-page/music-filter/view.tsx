import clsx from "clsx";
import { useList, useStoreMap, useUnit } from "effector-react";

import { AccordionFilter } from "~/shared/ui/accordion-filter";

import {
  $genreIdSelected,
  $genres,
  $subGenreIdSelected,
  $subGenres,
  genreChanged,
  subGenreChanged,
} from "./model";

export const MusicFilter = () => {
  return (
    <div className="grid grid-cols-2 items-start gap-2">
      <AccordionFilter title="Стили">
        <div className="grid grid-cols-3 gap-2">
          {useList($genres, {
            getKey: (item) => item.id,
            keys: [],
            fn: (item) => <GenreButton id={item.id} />,
          })}
        </div>
      </AccordionFilter>

      <AccordionFilter title="Субжанры">
        <div className="grid grid-cols-3 gap-2">
          {useList($subGenres, {
            getKey: (item) => item.id,
            keys: [],
            fn: (item) => <SubGenreButton id={item.id} />,
          })}
        </div>
      </AccordionFilter>
    </div>
  );
};

const GenreButton = ({ id }: { id: number }) => {
  const genre = useStoreMap({
    store: $genres,
    keys: [id],
    fn: (genres) => genres.find((item) => item.id === id),
  });

  const isSelected = useStoreMap({
    store: $genreIdSelected,
    keys: [id],
    fn: (genreIdSelected) => genreIdSelected === id,
  });

  const onSelect = useUnit(genreChanged);

  const handleSelect = () => {
    onSelect({ id });
  };

  return (
    <button
      className={clsx(
        "btn btn-primary no-animation btn-xs",
        isSelected ? "btn-primary" : "btn-outline",
      )}
      onClick={handleSelect}
    >
      {genre!.name}
    </button>
  );
};

const SubGenreButton = ({ id }: { id: number }) => {
  const subGenre = useStoreMap({
    store: $subGenres,
    keys: [id],
    fn: (subGenres) => subGenres.find((item) => item.id === id),
  });

  const isSelected = useStoreMap({
    store: $subGenreIdSelected,
    keys: [id],
    fn: (subGenreIdSelected) => subGenreIdSelected === id,
  });

  const onSelect = useUnit(subGenreChanged);

  const handleSelect = () => {
    onSelect({ id });
  };

  return (
    <button
      className={clsx(
        "btn btn-primary no-animation btn-xs",
        isSelected ? "btn-primary" : "btn-outline",
      )}
      onClick={handleSelect}
    >
      {subGenre!.name}
    </button>
  );
};
