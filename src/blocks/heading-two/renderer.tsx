import React from "react";

type HeadingTwoData = {
  text: string;
};

export default function HeadingTwoRenderer({
  data,
}: {
  data: HeadingTwoData;
}) {
  return (
    <h2 dir="rtl" className="text-right">
      {data.text}
    </h2>
  );
}