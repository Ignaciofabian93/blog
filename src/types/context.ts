import { type Request, type Response } from "express";

export type Context = {
  req: Request;
  res: Response;
  token?: string;
  sellerId?: string;
};

export type ResolverFn<TParent = unknown, TArgs = Record<string, unknown>, TResult = unknown> = (
  parent: TParent,
  args: TArgs,
  context: Context,
) => Promise<TResult> | TResult;
