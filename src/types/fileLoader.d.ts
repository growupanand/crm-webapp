/**
 * to solve type error while importing .svg file
 * Cannot find module './logo.svg' or its corresponding type declarations.ts(2307)
 */

declare module "*.svg" {
  const content: any;
  export default content;
}
