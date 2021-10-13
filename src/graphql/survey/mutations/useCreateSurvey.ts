import gql from 'graphql-tag'
import { useMutation, MutationHookOptions } from '@apollo/react-hooks'
import {
  CreateSurveyMutation,
  CreateSurveyMutationVariables,
  CreateSurveyInput,
  createSurvey as createSurveyMutation,
} from '@onextech/vts-api'
import { sanitizeData } from '../../../utils/data'

const useCreateSurvey = (args: MutationHookOptions<CreateSurveyMutation, CreateSurveyMutationVariables> = {}) => {
  const [createSurvey, onSurveyCreated] = useMutation(gql(createSurveyMutation), args)

  const handleCreateSurvey = (input: CreateSurveyInput) => {
    return createSurvey({ variables: { input: sanitizeData(input) } })
  }

  return { handleCreateSurvey, onSurveyCreated }
}

export default useCreateSurvey
