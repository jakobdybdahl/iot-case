import { ApplicationContainer } from './app-container';

let appContainer: ApplicationContainer | undefined;

export const makeAppContainer = async (): Promise<ApplicationContainer> => {
  // this function is ONLY used inside the make_event_entrypoint.ts or make_api_entrypoint.ts.
  // It is only called from one place per invocation and hence it is safe to cache the appContainer
  // and ignore the following eslint warning

  // eslint-disable-next-line require-atomic-updates
  appContainer = appContainer ?? (await ApplicationContainer.init());

  return appContainer;
};
