import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import registeredTypes from "./registeredTypes";

export const {nodeInterface, nodeField, nodesField} = nodeDefinitions(
    (globalId) => {
      const {type, id} = fromGlobalId(globalId);
      const registeredType = registeredTypes.find(x => {
        console.log('x: ', x);
        console.log('type: ', type);
        return type === x.name
      });
      return registeredType.loader(id);
    },
    (obj) => {
      console.log(obj);
      const registeredType = registeredTypes.find(x => obj instanceof x.dbType);
      if (registeredType) return  registeredType.qlType
      return null;
    }
);