import { getDevicesEndpoint } from '../../endpoints/get-devices/get-devices.endpoint';
import { fromEndpoint } from '../from-endpoint';

export const handler = fromEndpoint(getDevicesEndpoint());
