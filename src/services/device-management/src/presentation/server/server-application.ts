import express from 'express';
import { RawRequest } from '../endpoints/request';
import { toHttpMethod } from '../endpoints/utils';
import cors from 'cors';
import { ApplicationContainer } from '../dependency-injection/app-container';
import { EndpointHandler } from '../endpoints/make-endpoint';
import { LocalApplicationContainer } from './local-app-container';
import { getDevicesEndpoint } from '../endpoints/get-devices/get-devices.endpoint';
import { configIotListeners } from './mqtt-config';

type MakeEndpointHandlerFn = (
  appContainerFn: () => Promise<ApplicationContainer>,
) => EndpointHandler;

export class ServerApplication {
  private appContainer!: ApplicationContainer;

  public async run(): Promise<void> {
    const app = express();

    this.appContainer = await LocalApplicationContainer.init();

    await configIotListeners(this.appContainer);

    app.use(cors());
    app.use(express.json());

    app.get('/devices', this.endpoint(getDevicesEndpoint));

    const port = 3000;
    app.listen(port, () =>
      console.log(`Device Management service listening on port ${port}`),
    );
  }

  private endpoint(
    makeHandler: MakeEndpointHandlerFn,
  ): (
    req: express.Request,
    res: express.Response,
  ) => Promise<express.Response> {
    return async (req, res) => {
      const mappedRequest: RawRequest = {
        params: req.params,
        path: req.path,
        query: req.query as { [key: string]: string | string[] }, // TODO: is this safe?
        headers: req.headers,
        method: toHttpMethod(req.method),
        body: req.body,
      };

      const handler = makeHandler(() => Promise.resolve(this.appContainer));

      const response = await handler(mappedRequest);

      res.set(response.headers);

      if (response.status === 200) {
        return res.json(response.body);
      }

      if (response.status === 204) {
        return res.status(response.status).send();
      }

      if (response.status === 400) {
        return res.status(response.status).send(response.detail);
      }

      if (response.status === 403) {
        return res.status(response.status).send({ message: response.detail });
      }

      if (response.status === 401) {
        return res.status(response.status).send();
      }

      if (response.status === 500) {
        return res.status(response.status).send(response.message);
      }

      return res.status(response.status).send();
    };
  }
}
