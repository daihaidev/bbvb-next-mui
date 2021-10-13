import Pinpoint from 'aws-sdk/clients/pinpoint'
import { API } from 'aws-amplify'
import config from '../config'

const awsconfig = config.aws
const mailConfig = config.mail
const appConfig = config.app

const charset = 'UTF-8'
const appId = awsconfig.aws_mobile_analytics_app_id

interface GetPinpointParamsOptions {
  from?: string
}

const getPinpointParams = ({ to, subject, html, text, options = {} }: SendVariables) => ({
  ApplicationId: appId,
  MessageRequest: {
    Addresses: { [to]: { ChannelType: 'EMAIL' } },
    MessageConfiguration: {
      EmailMessage: {
        FromAddress: options.from || mailConfig.defaultFrom,
        SimpleEmail: {
          Subject: { Charset: charset, Data: subject },
          HtmlPart: { Charset: charset, Data: html },
          TextPart: { Charset: charset, Data: text },
        },
      },
    },
  },
})

const pinpointOptions = {
  region: awsconfig.aws_mobile_analytics_app_region,
  credentials: {
    accessKeyId: mailConfig.aws_pinpoint_access_key_id,
    secretAccessKey: mailConfig.aws_pinpoint_secret_access_key,
  },
}

const pinpoint = new Pinpoint(pinpointOptions)

export interface SendVariables {
  to: string
  subject: string
  html: string
  text: string
  options?: GetPinpointParamsOptions
}

/**
 * Send Email
 * Mail.send({ to: 'dev@onextech.com', subject: 'Test Subject', html: `<div>Test Body</div>`, body: 'Test Body' })
 */
const send = async (variables: SendVariables) => pinpoint.sendMessages(getPinpointParams(variables)).promise()

export interface SendTransactionVariables {
  to: string
  subject: string
  mailgen: object // Mailgen.content.body
}

/**
 * Send Transactional Email with Mailgen
 * Mail.send({ to: 'dev@onextech.com', subject: 'Test Subject', mailgen: MailgenBody })
 */
const sendTransaction = async (variables: SendTransactionVariables) => {
  const { to, subject, mailgen } = variables

  const { html, text } = await API.post('mailgen', '/mailgen', {
    body: {
      config: {
        name: appConfig.name,
        link: appConfig.absoluteUrl,
      },
      email: mailgen,
    },
  })

  return send({ to, subject, html, text })
}

const Mail = {
  client: pinpoint,
  send,
  sendTransaction,
}

/**
 * Mail.sendEmail(to, subject, html).promise()
 */
export default Mail
