import LCS from './lcs';
import types from './types';

Object.keys(types).forEach((typeName: string) => {
  // @ts-ignore
  LCS.registerType(typeName, types[typeName]);
});

export default LCS;
