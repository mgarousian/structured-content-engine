import React from "react";

type HeadingOneData = {
  text: string;
};

export default function HeadingOneRenderer({
  data,
}: {
  data: HeadingOneData;
}) {
  return (
    <h1 dir="rtl" className="text-right">
      {data.text}
    </h1>
  );
}
