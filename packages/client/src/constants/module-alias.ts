import { addAliases } from "module-alias";
import path from "path";

const configureModuleAliases = () => {
  addAliases({
    "@shared-core": path.join(__dirname, "../../../shared-core"),
  });
};

export default configureModuleAliases;
