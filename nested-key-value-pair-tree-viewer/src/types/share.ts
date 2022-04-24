export interface Tree {
  key: string;
  value: string;
  children: Record<string, Tree>;
}
