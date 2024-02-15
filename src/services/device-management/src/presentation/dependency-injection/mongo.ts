import { asClass, asFunction, asValue } from 'awilix';
import { MongoClient } from 'mongodb';
import { getFromEnv } from './common/get-env-variable';
import { ApplicationContainer } from './app-container';
import { ISecretManager } from '../../application/interfaces/secret-manager';
import { MongoDeviceRepository } from '../../infrastructure/data-access/mongo/device-repository';

export type MongoDbSettings = {
  connectionString: string;
  dbName: string;
};

const makeMongoDb = (mongoDbSettings: MongoDbSettings) => {
  const { connectionString, dbName } = mongoDbSettings;
  const mongoClient = new MongoClient(connectionString);
  return mongoClient.db(dbName);
};

export const registerMongoDb = async (container: ApplicationContainer) => {
  const secretManager = container.resolve<ISecretManager>('secretManager');

  const connectionString = await secretManager.get(
    getFromEnv('MONGODB_CONNECTION_STRING_SECRET_NAME'),
  );

  // base mongo db
  container.register({
    mongoDbSettings: asValue<MongoDbSettings>({
      connectionString,
      dbName: getFromEnv('MONGODB_DB_NAME'),
    }),
    mongoDb: asFunction(makeMongoDb, { lifetime: 'SINGLETON' }),
  });

  // repositories
  container.register({
    deviceRepository: asClass(MongoDeviceRepository, { lifetime: 'TRANSIENT' }),
  });
};
