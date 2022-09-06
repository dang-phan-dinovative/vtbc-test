import { Client, Session } from '@heroiclabs/nakama-js'

type TEmptyObject = Record<string, never>

type TMoveRpc = {
  x: number,
  y: number
}

type TMethodRpc = {
  healthcheck: TEmptyObject,
  move: TMoveRpc
}

type TResponseRpc = {
  healthcheck: { payload: { success: boolean } }
  move: { payload: number }
}

type TMethodKeys = keyof TMethodRpc

// function intersection produces - function overloads
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type Values<T> = T[keyof T]

/**
 * Generate all possible combinations of allowed arguments
 */
type AllOverloads = {
  [Prop in TMethodKeys]:
  Prop extends keyof TMethodRpc
  ? (client: Client, session: Session, key: Prop, data: TMethodRpc[Prop]) => Promise<TResponseRpc[Prop]>
  : (key: Prop) => any
}

/**
 * Convert all allowed combinations to function overload
 */
type Overloading = UnionToIntersection<Values<AllOverloads>>

export const callRPC: Overloading = async <Key extends TMethodKeys> (
  client: Client,
  session: Session,
  method: Key,
  payload: TMethodRpc[Key]
) => {
  return await client.rpc(session, method, payload) as Promise<TResponseRpc[Key]>
}
