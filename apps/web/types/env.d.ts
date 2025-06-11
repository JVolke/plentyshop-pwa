// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DEFAULTLANGUAGE: 'de' | 'en' | undefined; // <- Achten Sie auf diese exakten Typen
  }
}
