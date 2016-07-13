'use babel';
// @flow

declare class atom$Config {
  // Config Subscription
  observe(
    keyPath: string,
    optionsOrCallback?: (Object | (value: any) => void),
    callback?: (value: any) => void
  ): IDisposable;

  onDidChange(
    keyPathOrCallback: (string | (event: Object) => void),
    optionsOrCallback?: (Object | (event: Object) => void),
    callback?: (event: Object) => void
  ): IDisposable;

  // Managing Settings
  get(
    keyPath?: string,
    options?: {
      excludeSources?: Array<string>;
      sources?: Array<string>;
      scope?: Object;
    }
  ): mixed;

  // TODO: Upstream getAll() into nuclide
  getAll(
    keyPath?: string,
    options?: {
      excludeSources?: Array<string>;
      sources?: Array<string>;
      scope?: Object;
    }
  ): Array<{
    scopeDescriptor: atom$ScopeDescriptor;
    value: mixed;
  }>;

  set(
    keyPath: string,
    value: ?mixed,
    options?: {
      scopeSelector?: string;
      source?: string;
    },
  ): boolean;

  unset(
    keyPath: string,
    options?: {
      scopeSelector?: string;
      source?: string;
    }
  ): void;

  getUserConfigPath(): string;

  // Undocumented Methods
  getRawValue(keyPath: ?string, options: {excludeSources?: string; sources?: string}): mixed;
  getSchema(keyPath: string): atom$ConfigSchema;
  save(): void;
  setRawValue(keyPath: string, value: mixed): void;
  setSchema(
    keyPath: string,
    schema: atom$ConfigSchema,
  ): void;
}
