import React from "react";
import { Input } from "@/components/ui/input";

type HeadingTwoData = {
  text: string;
};

export default function HeadingTwoEditor({
  data,
  onChange,
}: {
  data: HeadingTwoData;
  onChange: (data: HeadingTwoData) => void;
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
        placeholder="متن عنوان ۲"
      />
    </div>
  );
}