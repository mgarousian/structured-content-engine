import React from "react";

type HeadingThreeData = {
  text: string;
};

export default function HeadingThreeRenderer({
  data,
}: {
  data: HeadingThreeData;
}) {
  return (
    <h3 dir="rtl" className="text-right">
      {data.text}
    </h3>
  );
}