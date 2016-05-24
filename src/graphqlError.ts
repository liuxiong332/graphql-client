export class GraphqlError extends Error {
  public errors: any[];

  constructor(errors) {
    super('GraphQL Error');
    this.name = 'GraphqlError';
    this.errors = errors;
  }
}
