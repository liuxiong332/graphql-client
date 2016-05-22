export class GraphqlError extends Error {
  public errors: string[];

  constructor(errors) {
    super("GraphQL Error");
    this.name = "GraphqlError";
    this.errors = errors;
  }
}
