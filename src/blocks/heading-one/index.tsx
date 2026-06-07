import React from "react";
import { BlockDefinition } from "../../types/blocks";
import { registerBlock } from "../registry";
import {
  HeadingTextData,
  HeadingTextEditor,
  HeadingTextRenderer,
} from "../heading/shared";

const headingOneBlock: BlockDefinition<HeadingTextData> = {
  type: "heading-one",
  label: "H1",
  persianLabel: "عنوان ۱",
  description: "عنوان سطح اول برای مقاله یا صفحه.",
  availableFor: ["blogPost"],
  source: "core",
  defaultData: {
    text: "",
  },
  renderer: (data) => (
    <HeadingTextRenderer data={data as HeadingTextData} tag="h1" />
  ),
  editor: (props) => <HeadingTextEditor {...(props as any)} />,
};

registerBlock(headingOneBlock);

export default headingOneBlock;