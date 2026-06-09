"use client";

import React from "react";
import {
  Command,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

export type SlashBlockMenuOption<TType extends string = string> = {
  type: TType;
  label: string;
  separatorBefore?: boolean;
};

export default function SlashBlockMenu<TType extends string>({
  options,
  selectedIndex,
  onSelectedIndexChange,
  onSelect,
}: {
  options: SlashBlockMenuOption<TType>[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onSelect: (option: SlashBlockMenuOption<TType>) => void;
}) {
  return (
    <Command className="rounded-md border border-border bg-popover text-popover-foreground shadow-md">
      <CommandList>
        <CommandGroup>
          {options.map((option, optionIndex) => (
            <React.Fragment key={option.type}>
              {option.separatorBefore ? <Separator className="my-1" /> : null}

              <button
                type="button"
                role="option"
                aria-selected={selectedIndex === optionIndex}
                className={
                  selectedIndex === optionIndex
                    ? "flex w-full items-center rounded-sm bg-accent px-2 py-1.5 text-sm text-accent-foreground outline-none"
                    : "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                }
                onMouseEnter={() => {
                  onSelectedIndexChange(optionIndex);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSelect(option);
                }}
              >
                {option.label}
              </button>
            </React.Fragment>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}