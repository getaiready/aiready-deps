/**
 * Centralized billing and resource inclusion constants.
 * Standardizing these ensures dashboard, billing, and cost-sync logic are consistent.
 */

export const BILLING_CONFIG = {
  // Platform Subscription Plans
  PLANS: {
    STARTER: {
      ID: 'starter',
      PRICE_CENTS: 2900,
      AWS_INCLUSION_CENTS: 1500, // $15.00 AWS credits included
      AI_FUEL_INCLUSION_CENTS: 1000, // $10.00 AI tokens included
      MAX_REPOS: 5,
    },
    PRO: {
      ID: 'pro',
      PRICE_CENTS: 9900,
      AWS_INCLUSION_CENTS: 5000, // $50.00 AWS credits included
      AI_FUEL_INCLUSION_CENTS: 5000, // $50.00 AI tokens included
      MAX_REPOS: 25,
    },
    TEAM: {
      ID: 'team',
      PRICE_CENTS: 29900,
      AWS_INCLUSION_CENTS: 15000, // $150.00 AWS credits included
      AI_FUEL_INCLUSION_CENTS: 15000, // $150.00 AI tokens included
      MAX_REPOS: -1, // Unlimited
    },
  },

  // Metered Charges
  MUTATION_TAX_CENTS: 100, // $1.00 per mutation (waived if opted-in)
  COMPUTE_OVERAGE_MARKUP: 1.2, // 20% margin on top of AWS cost for overages

  // Thresholds
  COST_WARNING_THRESHOLD: 0.8, // Warn user at 80% of their inclusion buffer
  AUTO_TOPUP_DEFAULT_AMOUNT_CENTS: 1000, // $10.00 standard refill
  AUTO_TOPUP_DEFAULT_THRESHOLD_CENTS: 200, // Refill when balance < $2.00
};

/**
 * Helper to get plan config by ID (e.g. 'starter', 'pro', 'team')
 */
export function getPlanConfig(planId?: string) {
  const normalizedId = planId?.toUpperCase() || 'STARTER';
  return (
    (BILLING_CONFIG.PLANS as any)[normalizedId] || BILLING_CONFIG.PLANS.STARTER
  );
}
