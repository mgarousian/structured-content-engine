import React from "react";
import HeadingTwoRenderer from "./renderer";
import HeadingTwoEditor from "./editor";
import { BlockDefinition } from "../../types/blocks";
import { registerBlock } from "../registry";

type HeadingTwoData = {
  text: string;
};

const headingTwoBlock: BlockDefinition<HeadingTwoData> = {
  type: "heading-two",
  label: "H2",
  persianLabel: "عنوان ۲",
  description: "عنوان سطح دوم برای بخش‌های مقاله.",
  availableFor: ["blogPost"],
  source: "core",
  defaultData: {
    text: "",
  },
  renderer: (data) => <HeadingTwoRenderer data={data as HeadingTwoData} />,
  editor: (props) => <HeadingTwoEditor {...(props as any)} />,
};

registerBlock(headingTwoBlock);

export default headingTwoBlock;