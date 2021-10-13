import { ID, ModelConditionInput, ModelStringInput } from '../typing'

export interface EnquiryInterface {
  id: ID
  name: string
  email: string
  mobile: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateEnquiryInput {
  id?: ID
  name?: string
  email?: string
  mobile?: string
  content: string
  createdAt?: string
  updatedAt?: string
}

interface BaseModelEnquiryConditionInput {
  name?: ModelStringInput
  email?: ModelStringInput
  mobile?: ModelStringInput
  content?: ModelStringInput
  createdAt?: ModelStringInput
  updatedAt?: ModelStringInput
}

export type ModelEnquiryConditionInput = ModelConditionInput<BaseModelEnquiryConditionInput>
