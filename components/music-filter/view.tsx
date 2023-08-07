import clsx from "clsx";
import React, { useState } from "react";
import { AccordionFilter } from "~/shared/ui/accordion-filter";

export const MusicFilter = () => {
  const [styleFilter, setStyleFilter] = useState<string[]>([]);
  const [subFilter, setSubFilter] = useState<string[]>([]);

  const handleSelectFilter = (name: string) => {
    const isExistFilter = styleFilter.find((item) => item === name);

    if (isExistFilter) {
      setStyleFilter(styleFilter.filter((item) => item !== name));
    } else {
      setStyleFilter([...styleFilter, name]);
    }
  };

  const handleSelectSubFilter = (name: string) => {
    const isExistFilter = subFilter.find((item) => item === name);

    if (isExistFilter) {
      setSubFilter(subFilter.filter((item) => item !== name));
    } else {
      setSubFilter([...subFilter, name]);
    }
  };

  return (
    <div className="grid grid-cols-2 items-start gap-2">
      <AccordionFilter title="Стили">
        <div className="grid grid-cols-3 gap-2">
          {["Rock", "Metal", "Dance", "Techno", "Pop", "DnB"].map((item) => (
            <button
              key={item}
              className={clsx(
                " btn btn-primary no-animation btn-xs",
                styleFilter.find((filter) => filter === item) ? "btn-primary" : "btn-outline",
              )}
              onClick={() => handleSelectFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </AccordionFilter>

      <AccordionFilter title="Субжанры">
        <div className="grid grid-cols-3 gap-2">
          {["Neuropunk", "Technoid", "Breaks", "Downchill", "Soulfull", "Chillout"].map((item) => (
            <button
              key={item}
              className={clsx(
                "btn  btn-primary no-animation btn-xs",
                subFilter.find((filter) => filter === item) ? "btn-primary" : "btn-outline",
              )}
              onClick={() => handleSelectSubFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </AccordionFilter>
    </div>
  );
};
