import { Entity } from '../../../domain/base-entity';

export type FindOptions = {
  limit?: number;
  offset?: number;
};

export type Repository<T extends Entity> = {
  find: (options?: FindOptions) => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  count: () => Promise<number>;
};
