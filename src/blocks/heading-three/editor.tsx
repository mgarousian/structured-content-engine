import React from "react";
import { Input } from "@/components/ui/input";

type HeadingThreeData = {
  text: string;
};

export default function HeadingThreeEditor({
  data,
  onChange,
}: {
  data: HeadingThreeData;
  onChange: (data: HeadingThreeData) => void;
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
        placeholder="متن عنوان ۳"
      />
    </div>
  );
}