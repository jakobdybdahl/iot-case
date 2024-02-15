import { z } from 'zod';
import { GetDevicesHandler } from '../../../application/handlers/get-devices.handler';
import { BaseEndpoint } from '../base-endpoint';
import { Request } from '../request';
import { Response } from '../response';
import { DeviceListResponse } from './devices-dto';
import { makeAppContainer } from '../../dependency-injection/make-app-container';
import { EndpointHandler, makeEndpoint } from '../make-endpoint';

export class GetDevicesEndpoint extends BaseEndpoint {
  private readonly handler: GetDevicesHandler;

  public constructor(getDevicesHandler: GetDevicesHandler) {
    super();
    this.handler = getDevicesHandler;
  }

  public async handle(req: Request): Promise<Response<DeviceListResponse>> {
    const querySchema = z.object({
      limit: z.coerce.number().int().positive().default(10),
      offset: z.coerce.number().int().nonnegative().default(0),
    });

    const parsedQuery = querySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return this.badRequest('Invalid query parameters', parsedQuery.error);
    }

    const { limit, offset } = parsedQuery.data;

    const devices = await this.handler.handle({
      limit,
      offset,
    });

    return this.ok(devices);
  }
}

export const getDevicesEndpoint = (
  appContainerFn = makeAppContainer,
): EndpointHandler => makeEndpoint(GetDevicesEndpoint)(appContainerFn);
