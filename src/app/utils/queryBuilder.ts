import { Query } from "mongoose";
import { excludedFields } from "../constants/exclidedFields";
import { TMeta } from "./SendResponse";

export class QueryBuilder<T> {
  public modelQurey: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQurey = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (let fields of excludedFields) {
      delete filter[fields];
    }

    this.modelQurey = this.modelQurey.find(filter);
    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerms = this.query?.searchTerms?.trim() || "";

    const searchQuery = {
      $or: searchableFields.map((fields: string) => ({
        [fields]: { $regex: searchTerms, $options: "i" },
      })),
    };

    this.modelQurey = this.modelQurey.find(searchQuery);

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQurey = this.modelQurey.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";

    this.modelQurey = this.modelQurey.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQurey = this.modelQurey.skip(skip).limit(limit);
    return this;
  }

  async getMeta(): Promise<TMeta> {
    const totalDoc = await this.modelQurey.clone().countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDoc / limit);

    return {
      limit,
      page,
      total: totalDoc,
      totalPage,
    };
  }

  build(): Promise<T[]> {
    return this.modelQurey;
  }
}
