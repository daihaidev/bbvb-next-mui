import { GetSurveyQuery, ListSurveysQuery } from '@onextech/vts-api'

export type SurveyInterface = GetSurveyInterface | ListSurveyInterface
export type GetSurveyInterface = GetSurveyQuery['getSurvey']
export type ListSurveyInterface = ListSurveysQuery['listSurveys']['items'][number]
