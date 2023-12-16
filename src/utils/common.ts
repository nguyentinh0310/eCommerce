import { pick } from 'lodash';

export const getInfoData = ({ fileds = [], object = {} }: { fileds: any[], object: Object }) => {
  return pick(object, fileds);
};

// ['a', 'b'] -> { a: 1, b: 1 }
export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

export const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

export const removeUnderfinedObject = (obj: Record<string, any>) => {
  Object.keys(obj).forEach(k => {
    if(obj[k] === null){
      delete obj[k]
    }
  })
  return obj
} 


export const updateNestedObjectParser =  (obj: Record<string, any>) => {
  const final: Record<string, any> = {}

  Object.keys(obj).forEach(k => {
    if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      console.log("bug")
      })
    } else {
      final[k] = obj[k]
    }
  })

  return final
}