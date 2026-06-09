import React from "react";
import HeadingOneRenderer from "./renderer";
import HeadingOneEditor from "./editor";
import { BlockDefinition } from "../../types/blocks";
import { registerBlock } from "../registry";

type HeadingOneData = {
  text: string;
};

const headingOneBlock: BlockDefinition<HeadingOneData> = {
  type: "heading-one",
  label: "H1",
  persianLabel: "عنوان ۱",
  description: "عنوان سطح اول برای مقاله یا صفحه.",
  availableFor: ["blogPost"],
  source: "core",
  defaultData: {
    text: "",
  },
  renderer: (data) => <HeadingOneRenderer data={data as HeadingOneData} />,
  editor: (props) => <HeadingOneEditor {...(props as any)} />,
};

registerBlock(headingOneBlock);

export default headingOneBlock;