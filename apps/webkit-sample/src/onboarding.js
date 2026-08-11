// Onboarding — the shape of the entrance, and the vocabularies it asks from.
//
// Signup ends in three steps, in this order, and the order is the argument:
//
//   1. ORGANIZATION — who the user is and what their organization is called. It
//      comes first because it is the only step whose answers the console needs to
//      exist at all: the name, the mark and the greeting are what the wire beside
//      the form is drawing, so the user sees the thing they are naming while they
//      name it.
//   2. PLAN — which Azion plan the organization starts on. Second, not first: a
//      tier is a decision about work that has a name and an owner, and asking it
//      before either exists makes the user commit to a contract for a thing that
//      isn't a thing yet.
//   3. PROFILE — how they plan to use Azion, what they do, and whether they want
//      an expert on a call. Last because none of it CONSTRAINS the account: the
//      two questions are answered before Create organization, but no answer
//      changes the plan, the access or anything the user can do — they only shape
//      what gets recommended next. So they sit behind the two steps that decide
//      something, and a user who reads no further than the title still gets them
//      right.
//
// Progress is a ProgressBar across the top edge of the card, `value` = the step
// the user is on. It reads as "one of three underway", which is what a first step
// with answers in it actually is — a bar still at zero on a screen you have
// already filled in reads as broken.
export const onboardingSteps = [
  {
    id: "organization",
    title: "Create your organization",
    description:
      "Everything you deploy on Azion lives inside an organization. Yours is created once, here, and you can invite people into it afterwards.",
  },
  {
    id: "plan",
    title: "Select your plan",
    description:
      "What you are building decides the plan. You can change it later from Billing. Nothing here is locked in.",
  },
  {
    id: "profile",
    title: "Tell us about your work",
    description:
      "Two answers, and they only shape what we recommend you next. Neither changes your plan or what you can do.",
  },
];

// How the user plans to use Azion. Three answers, because the useful distinction
// is only the context the work happens in — anything finer is a question the user
// has to interpret before they can answer it.
export const usageOptions = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "study", label: "Study" },
];

// What the user does. A flat list rather than grouped families: at ten options a
// grid is faster to scan than any taxonomy imposed on it, and "Other" is last so
// the specific answers are read first.
//
// Sentence case, like every other option label in the product — a job title is not
// a proper noun, so "Software developer" is the correct casing and "Software
// Developer" is Title Case borrowed from a form that predates the rule. The
// capitals that survive are the ones that are capitals on their own: `DevOps` is a
// name, and `AI/ML` and `IoT` are acronyms.
export const roleOptions = [
  { value: "software_developer", label: "Software developer" },
  { value: "devops_engineer", label: "DevOps engineer" },
  { value: "infrastructure_analyst", label: "Infrastructure analyst" },
  { value: "network_engineer", label: "Network engineer" },
  { value: "security_specialist", label: "Security specialist" },
  { value: "data_engineer", label: "Data engineer" },
  { value: "ai_ml_engineer", label: "AI/ML engineer" },
  { value: "iot_engineer", label: "IoT engineer" },
  { value: "team_lead", label: "Team lead" },
  { value: "other", label: "Other" },
];

// The profile answers are stored as `additional_data` on the organization — the
// same generic key–value model `additionalDataKeys` describes for the console's
// own Create Organization flow. Only answered keys are stored; an unanswered one
// is absent, not present-and-empty.
export const profileDataKeys = {
  usage: "usage",
  role: "role",
  session: "onboarding_session",
};
