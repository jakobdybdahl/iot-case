import { Collection, Db } from 'mongodb';
import { Entity } from '../../../domain/base-entity';
import { Repository } from '../../../application/interfaces/repositories/base-repository';

export abstract class MongoRepository<T extends Entity>
  implements Repository<T>
{
  protected readonly collection: Collection<T>;

  public constructor(mongoDb: Db, collectionName: string) {
    this.collection = mongoDb.collection(collectionName);
  }

  public async findById(id: string): Promise<T | null> {
    const entity = await this.collection.findOne({
      id: undefined,
    });

    if (!entity) {
      return null;
    }

    const { _id, ...rest } = entity;

    return rest as any;
  }

  public count(): Promise<number> {
    return this.collection.countDocuments();
  }

  public async find(options?: {
    limit?: number;
    offset?: number;
  }): Promise<T[]> {
    const entities = await this.collection
      .find({}, { limit: options?.limit, skip: options?.offset })
      .toArray();

    return entities.map((e) => {
      const { _id, ...rest } = e;

      return rest as any;
    });
  }
}
