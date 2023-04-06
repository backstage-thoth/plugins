export type Metadata = {
  category: string;
  tier: Tier;
};

export enum Category {
  Documentation = 'Documentation',
  Observability = 'Observability',
  Readability = 'Readability',
  Reliability = 'Reliability',
  Security = 'Security',
  ServiceOwnership = 'Service Ownership',
}

export enum Tier {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum CheckId {
  OwnerCheck = 'ownerCheck',
  GroupOwnerCheck = 'groupOwnerCheck',
  TitleCheck = 'titleCheck',
  HasDescription = 'hasDescription',
  LifecycleCheck = 'lifecycleCheck',
  HasTags = 'hasTags',
  TechDocsCheck = 'techDocsCheck',
  HasIncidentTool = 'hasIncidentTool',
  HasAlertTool = 'hasAlertTool',
  HasMetricsTool = 'hasMetricsTool',
  HasBacklogTool = 'hasBacklogTool',
  HasLoggingTool = 'hasLoggingTool',
}
