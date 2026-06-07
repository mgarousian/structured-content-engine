import React from "react";
import { Input } from "@/components/ui/input";

type HeadingOneData = {
  text: string;
};

export default function HeadingOneEditor({
  data,
  onChange,
}: {
  data: HeadingOneData;
  onChange: (data: HeadingOneData) => void;
}) {
  return (
    <div dir="rtl" className="text-right">
      <Input
        value={data.text}
        onChange={(event) => {
          onChange({
            ...data,
            text: event.target.value,
          });
        }}
        placeholder="متن عنوان ۱"
      />
    </div>
  );
}