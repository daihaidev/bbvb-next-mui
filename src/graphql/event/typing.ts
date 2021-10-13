import { GetEventQuery, ListEventsQuery } from '@onextech/etc-api'

export type EventInterface = GetEventInterface | ListEventInterface
export type GetEventInterface = GetEventQuery['getEvent']
export type ListEventInterface = ListEventsQuery['listEvents']['items']
