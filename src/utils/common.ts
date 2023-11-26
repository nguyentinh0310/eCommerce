import { pick } from 'lodash';

export const getInfoData = ({ fileds = [], object = {} }: { fileds: any[], object: Object }) => {
  return pick(object, fileds);
};
