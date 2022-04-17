import {
  create,
  IWorkbenchConstructionOptions,
  IWorkspaceProvider,
  IWorkspace,
} from "vs/workbench/workbench.web.main";
import { URI, UriComponents } from "vs/base/common/uri";
declare const window: any;

(async function () {
  // create workbench
  let config: IWorkbenchConstructionOptions & {
    folderUri?: UriComponents;
    workspaceUri?: UriComponents;
  } = {};

  console.log('initial workbench.config', config);
  if (window.product) {
    config = window.product;
    console.log('from workbench.product', config);
  } else {
    const result = await fetch("/product.json");
    config = await result.json();
    console.log('from /product.json', config);
  }

  console.log('btwiuse 1', config);

  if (Array.isArray(config.additionalBuiltinExtensions)) {
    const tempConfig = { ...config };

    tempConfig.additionalBuiltinExtensions =
      config.additionalBuiltinExtensions.map((ext) => URI.revive(ext));
    config = tempConfig;
  }

  console.log('btwiuse 2', config);

  let workspace;
  if (config.folderUri) {
    workspace = { folderUri: URI.revive(config.folderUri) };
  } else if (config.workspaceUri) {
    workspace = { workspaceUri: URI.revive(config.workspaceUri) };
  } else {
    workspace = undefined;
  }

  console.log('btwiuse 3', config);

  if (workspace) {
    const workspaceProvider: IWorkspaceProvider = {
      workspace,
      open: async (
        workspace: IWorkspace,
        options?: { reuse?: boolean; payload?: object }
      ) => true,
      trusted: true,
    };
    config = { ...config, workspaceProvider };
  }

  console.log('btwiuse 4', config);

  config = {
	  ...config,
	  remoteAuthority: "127.0.0.1:8081",
  };

  create(document.body, config);
})();
