declare module "simple-prompt-promise" {
  function prompt(question: string): Promise<string>;
  export = prompt;
}
