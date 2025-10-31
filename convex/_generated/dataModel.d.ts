/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = "photos";

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> = TableName extends "photos"
  ? {
      _id: GenericId<"photos">;
      _creationTime: number;
      imageId: string;
      userId: string;
      username: string;
      profileImage?: string;
      createdAt: number;
      likes: string[];
    }
  : never;

export type Id<TableName extends TableNames> = GenericId<TableName>;

/**
 * Use this for your data model
 */
export type DataModel = AnyDataModel;
