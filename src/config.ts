export default {
  /**
   * This value is arbitrary and used when making GQL queries to AppSync.
   */

  arbitraryQueryLimit: 1000,
  app: {
    name: 'BetaBlocks',
    companyName: 'BetaBlocks Pte Ltd',
    absoluteUrl: 'https://www.beta-blocks.com',
  },
  meta: {
    title: 'BetaBlocks',
  },
  aws: {
    aws_project_region: process.env.aws_project_region,
    aws_appsync_graphqlEndpoint: process.env.aws_appsync_graphqlEndpoint,
    aws_appsync_region: process.env.aws_appsync_region,
    aws_appsync_authenticationType: process.env.aws_appsync_authenticationType,
    aws_appsync_apiKey: process.env.aws_appsync_apiKey,
    aws_cloud_logic_custom: [
      {
        name: 'stripe',
        endpoint: process.env.aws_cloud_logic_custom_stripe_endpoint,
        region: 'ap-southeast-1',
      },
      {
        name: 'mailgen',
        endpoint: process.env.aws_cloud_logic_custom_mailgen_endpoint,
        region: 'ap-southeast-1',
      },
    ],
    aws_cognito_identity_pool_id: process.env.aws_cognito_identity_pool_id,
    aws_cognito_region: process.env.aws_cognito_region,
    aws_user_pools_id: process.env.aws_user_pools_id,
    aws_user_pools_web_client_id: process.env.aws_user_pools_web_client_id,
    oauth: {},
    aws_user_files_s3_bucket: process.env.aws_user_files_s3_bucket,
    aws_user_files_s3_bucket_region: process.env.aws_user_files_s3_bucket_region,
    aws_mobile_analytics_app_id: process.env.aws_mobile_analytics_app_id,
    aws_mobile_analytics_app_region: process.env.aws_mobile_analytics_app_region,
  },
  eventID: 'h1miTC_x8Z4dJ0fNXRP99',
  mail: {
    aws_pinpoint_access_key_id: process.env.aws_pinpoint_access_key_id,
    aws_pinpoint_secret_access_key: process.env.aws_pinpoint_secret_access_key,
    defaultFrom: 'Dev 1XT <dev@onextech.com>',
  },
  stripe: {
    publicKey: process.env.stripe_public_key,
  },
  analytics: {
    ga: {
      trackingId: 'UA-177512055-1',
    },
  },
  seo: {
    title: 'BetaBlocks',
    description: '',
    image: '',
    url: 'https://beta-blocks.com',
  },
  socialProfileLinks: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
  },
  queryDateLimit: {
    amount: 5,
    unitOfTime: 'years',
  },
}
