// @ts-nocheck - SST types are incomplete for many properties
/// <reference path="./.sst/platform/config.d.ts" />
/// <reference path="../../types/sst-stripe.d.ts" />

// Suppress AWS SDK warning when both profile and static keys are set
// by prioritizing the profile (which is the project standard)
if (
  process.env.AWS_PROFILE &&
  (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY)
) {
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
}

export default $config({
  app(input) {
    return {
      name: 'aiready-clawmore',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        stripe: true,
      },
    };
  },
  async run() {
    const isProd = $app.stage === 'production';

    // Configure the Stripe provider explicitly (matching platform pattern)
    const stripeProvider = new stripe.Provider('StripeProvider', {
      apiKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    });

    const domainName = isProd ? 'clawmore.ai' : `${$app.stage}.clawmore.ai`;

    // --- Secrets (Security Hardening) ---
    const StripeSecretKey = new sst.Secret('StripeSecretKey');
    const GithubServiceToken = new sst.Secret('GithubServiceToken');
    const GithubClientSecret = new sst.Secret('GithubClientSecret');
    const GoogleClientSecret = new sst.Secret('GoogleClientSecret');
    const AdminPassword = new sst.Secret('AdminPassword');
    const SpokeMiniMaxApiKey = new sst.Secret('SpokeMiniMaxApiKey');
    const SpokeGithubToken = new sst.Secret('SpokeGithubToken');

    // --- Stripe Products & Prices (IaC) ---
    // Note: These are ClawMore-specific Stripe resources, separate from Platform project

    // 1. Solo Plan ($29/mo)
    const clawmoreSoloProduct = new stripe.Product(
      'ClawMoreSoloProduct',
      {
        name: 'ClawMore Solo',
        description:
          'Managed AWS infrastructure, AI-powered code fixes, CI/CD integration, and dashboard.',
      },
      { provider: stripeProvider }
    );

    const clawmoreSoloPrice = new stripe.Price(
      'ClawMoreSoloPrice',
      {
        product: clawmoreSoloProduct.id,
        unitAmount: 2900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { tier: 'solo' },
      },
      { provider: stripeProvider }
    );

    // 2. Team Plan ($99/mo)
    const clawmoreTeamPrice = new stripe.Price(
      'ClawMoreTeamPrice',
      {
        product: clawmoreSoloProduct.id,
        unitAmount: 9900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { tier: 'team' },
      },
      { provider: stripeProvider }
    );

    // 3. Enterprise Plan ($299/mo)
    const clawmoreEnterprisePrice = new stripe.Price(
      'ClawMoreEnterprisePrice',
      {
        product: clawmoreSoloProduct.id,
        unitAmount: 29900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { tier: 'enterprise' },
      },
      { provider: stripeProvider }
    );

    // 4. AI Fuel Pack ($10.00 one-time top-up)
    const clawmoreFuelPackProduct = new stripe.Product(
      'ClawMoreFuelPackProduct',
      {
        name: 'ClawMore AI Credit Pack',
        description: '$10 top-up for AI-powered code fixes.',
      },
      { provider: stripeProvider }
    );

    const clawmoreFuelPackPrice = new stripe.Price(
      'ClawMoreFuelPackPrice',
      {
        product: clawmoreFuelPackProduct.id,
        unitAmount: 1000,
        currency: 'usd',
      },
      { provider: stripeProvider }
    );

    // 5. Mutation Tax ($1.00 per mutation)
    const clawmoreMutationTaxPrice = new stripe.Price(
      'ClawMoreMutationTaxPrice',
      {
        product: clawmoreSoloProduct.id,
        unitAmount: 100,
        currency: 'usd',
        recurring: {
          interval: 'month',
          intervalCount: 1,
        },
      },
      { provider: stripeProvider }
    );

    // 6. Stripe Webhook Endpoint
    const webhookEndpoint = new stripe.WebhookEndpoint(
      'ClawMoreStripeWebhook',
      {
        url: `https://${domainName}/api/webhooks/stripe`,
        enabledEvents: [
          'checkout.session.completed',
          'invoice.paid',
          'invoice.payment_failed',
          'customer.subscription.updated',
          'customer.subscription.deleted',
        ],
      },
      { provider: stripeProvider }
    );

    // Storage for ClawMore Managed Platform data
    // NOTE: Enable Point-in-Time Recovery (PITR) via AWS Console after deployment
    // for production data protection. SST v4 does not expose PITR in constructor.
    const table = new sst.aws.Dynamo('ClawMoreTable', {
      fields: {
        PK: 'string',
        SK: 'string',
        GSI1PK: 'string',
        GSI1SK: 'string',
      },
      primaryIndex: { hashKey: 'PK', rangeKey: 'SK' },
      globalIndexes: {
        GSI1: { hashKey: 'GSI1PK', rangeKey: 'GSI1SK' },
      },
    });

    // EventBridge Bus for managed events (e.g. mutations)
    const bus = new sst.aws.Bus('ClawMoreBus');

    // Note: EventBridge bus policy for organization-wide access
    // This would require raw AWS provider which is not configured
    // For now, we'll skip this and rely on IAM permissions

    // Queue for fair-use AI task processing
    const aiQueue = new sst.aws.Queue('AIQueue', {
      visibilityTimeout: '5 minutes',
    });

    // Storage for leads
    const leads = new sst.aws.Bucket('Leads', {
      public: false,
    });

    // SNS Topic for notifications
    const topic = new sst.aws.SnsTopic('LeadNotifications');
    // Note: SNS subscription requires raw AWS provider which is not configured
    // For now, notifications will be handled through the application

    // API Gateway for lead submissions (standalone to match landing pattern)
    const api = new sst.aws.ApiGatewayV2('LeadApi', {
      cors: true,
    });

    api.route('POST /submit', {
      handler: 'api/submit-lead.handler',
      link: [leads, topic],
      environment: {
        LEADS_BUCKET: leads.name,
        TOPIC_ARN: topic.arn,
      },
    });

    // Managed Platform Functions
    const _createAccount = new sst.aws.Function('CreateManagedAccount', {
      handler: 'functions/create-managed-account.handler',
      timeout: '15 minutes',
      link: [table],
      permissions: [
        {
          actions: [
            'organizations:CreateAccount',
            'organizations:DescribeCreateAccountStatus',
            'organizations:ListPolicies',
            'organizations:CreatePolicy',
            'organizations:AttachPolicy',
            'sts:AssumeRole',
          ],
          resources: ['*'],
        },
      ],
    });

    const reportMutationTax = new sst.aws.Function('ReportMutationTax', {
      handler: 'functions/report-mutation-tax.handler',
      link: [table, StripeSecretKey],
    });

    bus.subscribe('MutationReporting', reportMutationTax.arn, {
      pattern: {
        detailType: ['MutationPerformed'],
      },
    });

    const handleDeploymentComplete = new sst.aws.Function(
      'HandleDeploymentComplete',
      {
        handler: 'functions/handle-deployment-complete.handler',
        link: [table],
      }
    );

    bus.subscribe('DeploymentTracking', handleDeploymentComplete.arn, {
      pattern: {
        detailType: ['DeploymentStatus'],
      },
    });

    new sst.aws.Function('CreateCheckoutSession', {
      handler: 'functions/create-checkout-session.handler',
      link: [table, StripeSecretKey],
    });

    new sst.aws.Cron('CostSyncCron', {
      schedule: 'rate(12 hours)',
      job: {
        handler: 'functions/cost-sync.handler',
        timeout: '5 minutes',
        link: [table, StripeSecretKey],
        permissions: [
          {
            actions: ['ce:GetCostAndUsage', 'organizations:ListAccounts'],
            resources: ['*'],
          },
        ],
      },
    });

    new sst.aws.Cron('AutoTopupCron', {
      schedule: 'rate(1 hour)',
      job: {
        handler: 'functions/auto-topup-check.handler',
        timeout: '5 minutes',
        link: [table, StripeSecretKey],
      },
    });

    const site = new sst.aws.Nextjs('ClawMoreSite', {
      path: '.',
      dev: {
        command: 'pnpm run dev:next',
        autostart: true,
      },
      domain: {
        name: domainName,
        dns: sst.cloudflare.dns({
          zone: '1714b0c27187ccfe2b1ddf3c1ec261a6',
        }),
      },
      environment: {
        NEXT_PUBLIC_APP_URL: `https://${domainName}`,
        LEAD_API_URL: api.url,
        LEADS_BUCKET: leads.name,
        DYNAMO_TABLE: table.name,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        CLAW_MORE_BUS: bus.name,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
        ADMIN_EMAILS: process.env.ADMIN_EMAILS || '',
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
        NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
          process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
        AUTH_SECRET:
          process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '',
      },
      permissions: [
        {
          actions: ['ses:SendEmail', 'ses:SendRawEmail'],
          resources: ['*'],
        },
      ],
      link: [
        api,
        leads,
        table,
        aiQueue,
        bus,
        clawmoreSoloPrice,
        clawmoreTeamPrice,
        clawmoreEnterprisePrice,
        clawmoreFuelPackPrice,
        clawmoreMutationTaxPrice,
        StripeSecretKey,
        GithubServiceToken,
        GithubClientSecret,
        GoogleClientSecret,
        AdminPassword,
        SpokeMiniMaxApiKey,
        SpokeGithubToken,
      ],
      // Note: SST automatically exposes linked secrets as environment variables
      // The secrets (GithubClientSecret, GoogleClientSecret, AdminPassword) will be available
      // as environment variables with the same name as the secret resource
    });

    return {
      site: site.url,
      domain: domainName,
      apiUrl: api.url,
      leadsBucket: leads.name,
      stripeWebhookUrl: webhookEndpoint.url,
    };
  },
});
