# 3-Sprint Plan: RevenueCat Payments, Qailos Usage, Influencer KPIs, Admin KPIs

## Scope

This plan covers:

- RevenueCat payment integration for Free, Standard, Premium, and addons.
- Google Pay and Apple Pay support through the configured RevenueCat checkout/payment flow.
- Qailos-based AI usage metering for OpenAI and Gemini APIs.
- Influencer referral code tracking.
- Admin portal KPI updates.

## Business Rules

### Qailos Definition

1 Qailo = EUR 0.001 of real AI cost.

Coefficients must be stored in the database and editable from the admin panel without deployment.

### Initial Qailos Coefficients

| Component | EUR / Token | Qailos / Token |
| --- | ---: | ---: |
| GPT-4o Mini Input | 0.000000138 | 0.000138 |
| GPT-4o Mini Output | 0.000000552 | 0.000552 |
| Gemini Audio Input | 0.000002566 | 0.002566 |
| Gemini Audio Output | 0.000010195 | 0.010195 |
| Gemini Live Text | 0.000000648 | 0.000648 |

## Recommended Timeline

Total: 3 sprints.

Recommended sprint length: 2 weeks each.

Total estimated duration: 6 weeks.

Backend effort: all 3 sprints.

Frontend/admin effort: all 3 sprints.

QA/UAT: starts in Sprint 2 and completes in Sprint 3.

---

## Sprint 1: Payment Foundation, Subscription Model, Qailos Architecture

### Goal

Build the foundation for subscriptions, RevenueCat, Qailos metering, and admin configuration.

### Backend Tasks

- Configure RevenueCat project, products, offerings, and entitlements.
- Define plans: Free, Standard, Premium.
- Define addon package model for extra quota/Qailos.
- Create RevenueCat webhook endpoint.
- Store RevenueCat customer ID against app user.
- Store subscription status, entitlement, renewal, cancellation, and billing issue events.
- Create Qailos coefficient table.
- Create Qailos ledger table.
- Create AI usage log table.
- Identify all OpenAI and Gemini APIs that consume AI cost.
- Add backend service/helper for calculating Qailos from provider usage.

### Frontend Tasks

- Create subscription/pricing page.
- Show Free, Standard, Premium packages.
- Show addon purchase options.
- Show current subscription state.
- Add payment success/failure handling.
- Add basic Qailos balance display placeholder.
- Add admin screen for Qailos coefficients.

### Database Tables

```text
plans
plan_entitlements
addons
user_subscriptions
revenuecat_events
qailo_coefficients
qailo_ledger
ai_usage_logs
```

### Backend APIs

```text
GET /api/subscriptions/plans/
GET /api/subscriptions/current/
POST /api/subscriptions/sync/
POST /api/webhooks/revenuecat/

GET /api/addons/
POST /api/addons/purchase-session/

GET /api/me/qailos-balance/
GET /api/admin/qailo-coefficients/
PUT /api/admin/qailo-coefficients/:id/
```

### Deliverables

- User can see packages and addons.
- Backend can receive RevenueCat webhook events.
- Admin can view/edit Qailos coefficients.
- Qailos database foundation is ready.

---

## Sprint 2: AI Usage Metering, Quota Enforcement, Referral Foundation

### Goal

Update OpenAI/Gemini APIs to debit Qailos and add influencer referral tracking.

### Backend Tasks

- Update every OpenAI API to log input/output token usage.
- Update every Gemini API to log audio/text usage.
- Convert provider usage into Qailos using database coefficients.
- Deduct Qailos from user balance/package quota.
- Support addon balance when package quota is exhausted.
- Add insufficient quota handling.
- Add idempotency protection to avoid duplicate charging.
- Add influencer table.
- Add referral code generation.
- Add referral attribution during signup/onboarding.
- Track users who joined using influencer referral code.

### Frontend Tasks

- Show user Qailos balance.
- Show Qailos usage history.
- Show package quota and addon quota separately.
- Show quota exceeded state.
- Add buy-addon CTA when quota is exhausted.
- Add influencer management list in admin.
- Add create/edit influencer form.
- Add referral code display/copy action.

### Affected AI APIs

All endpoints that call:

```text
OpenAI
GPT-4o Mini
Gemini Audio
Gemini Live Text
```

Common affected API groups:

```text
POST /api/ai/*
POST /api/openai/*
POST /api/gemini/*
POST /api/chat/*
POST /api/audio/*
POST /api/live/*
```

### Backend APIs

```text
GET /api/me/qailos-balance/
GET /api/me/qailos-usage/
GET /api/me/subscription/

POST /api/admin/qailos/adjust/
GET /api/admin/qailos-ledger/
GET /api/admin/ai-usage/
GET /api/admin/ai-usage/by-user/:userId/

GET /api/admin/influencers/
POST /api/admin/influencers/
GET /api/admin/influencers/:id/
PUT /api/admin/influencers/:id/
DELETE /api/admin/influencers/:id/

POST /api/referrals/validate/
POST /api/referrals/apply/
GET /api/admin/referrals/
```

### Database Tables

```text
influencers
referral_codes
referral_attributions
```

### Deliverables

- AI usage is charged in Qailos.
- User balance updates after OpenAI/Gemini usage.
- Addons are used when primary quota is exhausted.
- Admin can create influencers and referral codes.
- Referral attribution is tracked.

---

## Sprint 3: Influencer KPIs, Admin KPIs, QA, Production Readiness

### Goal

Complete KPI dashboards, reporting, testing, and release preparation.

### Backend Tasks

- Add admin KPI aggregation.
- Add influencer KPI aggregation.
- Add revenue/subscription KPI endpoints.
- Add Qailos usage/cost KPI endpoints.
- Add addon revenue and usage metrics.
- Add filters by date range, plan, influencer, and subscription status.
- Add CSV export endpoint.
- Add audit logging for admin updates to Qailos coefficients and plans.
- Harden RevenueCat webhook verification.
- Add QA test coverage for subscription and Qailos billing scenarios.

### Frontend Tasks

- Build admin dashboard KPI cards.
- Build subscription KPI charts.
- Build Qailos usage/cost dashboard.
- Build influencer KPI dashboard.
- Build referred users table.
- Build addon revenue/usage dashboard.
- Add filters and date range controls.
- Add export CSV button.
- Polish empty, loading, and error states.

### Admin KPI APIs

```text
GET /api/admin/kpis/overview/
GET /api/admin/kpis/revenue/
GET /api/admin/kpis/subscriptions/
GET /api/admin/kpis/qailos/
GET /api/admin/kpis/ai-costs/
GET /api/admin/kpis/influencers/
GET /api/admin/kpis/addons/
GET /api/admin/kpis/export/
```

### Influencer KPI APIs

```text
GET /api/admin/influencers/:id/kpis/
GET /api/admin/influencers/:id/referred-users/
GET /api/admin/referrals/kpis/
```

### Admin KPIs

```text
MRR
ARR
active_subscribers
free_users
standard_users
premium_users
addon_revenue
total_qailos_allocated
total_qailos_used
remaining_qailos
real_ai_cost
gross_margin
top_ai_cost_users
top_referral_codes
failed_payments
churn_rate
```

### Influencer KPIs

```text
total_signups
active_users
paid_conversions
conversion_rate
revenue_generated
active_subscriptions
cancelled_subscriptions
qailos_used_by_referred_users
addon_purchases
addon_revenue
```

### QA Checklist

```text
Free plan access works.
Standard purchase works.
Premium purchase works.
Addon purchase works.
RevenueCat webhook updates subscription correctly.
Cancelled subscription is reflected correctly.
Expired subscription blocks premium features.
OpenAI usage deducts correct Qailos.
Gemini audio usage deducts correct Qailos.
Gemini live text usage deducts correct Qailos.
Insufficient quota blocks AI request.
Addon quota is consumed after package quota.
Referral code attribution works.
Influencer KPIs match referred users.
Admin KPI numbers match backend records.
Qailos coefficient update affects future usage only.
```

### Deliverables

- Admin portal has subscription, Qailos, AI cost, addon, and influencer KPIs.
- All major payment and AI metering flows are tested.
- System is ready for staging/UAT release.

---

## 3-Sprint Delivery Summary

| Sprint | Backend | Frontend/Admin | Main Deliverable |
| --- | --- | --- | --- |
| Sprint 1 | RevenueCat foundation, subscription schema, Qailos schema | Pricing UI, addon UI, coefficient admin UI | Payments and Qailos foundation |
| Sprint 2 | AI usage metering, quota deduction, referral backend | Qailos balance/usage UI, influencer CRUD | Qailos charging and referrals |
| Sprint 3 | KPI APIs, reporting, QA hardening | Admin KPIs, influencer KPIs, exports | Production-ready KPI release |

## Risk Notes

- Three sprints is possible, but only if payment products and RevenueCat configuration are ready early.
- Apple Pay and Google Pay availability depends on the platform and RevenueCat/payment configuration.
- The highest-risk item is accurate Qailos metering across all OpenAI/Gemini APIs.
- Qailos coefficient changes should apply to future usage only unless the client explicitly wants historical recalculation.
- Webhook idempotency is required to avoid duplicate subscription/addon crediting.

