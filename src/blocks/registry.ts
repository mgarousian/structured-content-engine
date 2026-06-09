import { BlockDefinition, BlockRegistryMap } from "../types/blocks";

const registry: BlockRegistryMap = {};

export const registerBlock = <T>(def: BlockDefinition<T>) => {
  if (!def || !def.type) throw new Error("Block definition must have a type");
  registry[def.type] = def as BlockDefinition<any>;
};

export const getBlock = (type: string) => registry[type];

export const listBlocks = () => Object.values(registry);

export const clearRegistry = () => {
  Object.keys(registry).forEach((k) => delete registry[k]);
};

export default registry;