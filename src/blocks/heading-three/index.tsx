import React from "react";
import HeadingThreeRenderer from "./renderer";
import HeadingThreeEditor from "./editor";
import { BlockDefinition } from "../../types/blocks";
import { registerBlock } from "../registry";

type HeadingThreeData = {
  text: string;
};

const headingThreeBlock: BlockDefinition<HeadingThreeData> = {
  type: "heading-three",
  label: "H3",
  persianLabel: "عنوان ۳",
  description: "عنوان سطح سوم برای زیربخش‌های مقاله.",
  availableFor: ["blogPost"],
  source: "core",
  defaultData: {
    text: "",
  },
  renderer: (data) => <HeadingThreeRenderer data={data as HeadingThreeData} />,
  editor: (props) => <HeadingThreeEditor {...(props as any)} />,
};

registerBlock(headingThreeBlock);

export default headingThreeBlock;