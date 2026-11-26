export type OptionOk<T> = { data: T; ok: true };
export type OptionNotOk = { ok: false; error?: string };
export type Option<T> = OptionOk<T> | OptionNotOk;
