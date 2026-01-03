export const GitProviders = {
  github: 'github',
  azure: 'azureDevOps',
} as const;
export type GitProviderEnum = keyof typeof GitProviders;

export type PersonalAccessToken = {
  id: string;
  name: string;
  value: string;
  owner: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  expiredAt?: string;
  updatedAt?: string;
};

export type Repository = {
  id: string;
  name: string;
  description: string;
  personalAccessTokenIDs: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type GitProvider = {
  name: string;
  organizationID: string;
  personalAccessTokens: PersonalAccessToken[] | null;
  repositories: Repository[] | null;
};

export type AddPATData = {
  name: string;
  value: string;
  owner: string;
};

export type AddGithubPATData = Omit<AddPATData, 'owner'>;
export type AddAzureDevOpsPATData = AddPATData;

export type AddPATResponse = { credentialID: string };

export type UpdatePATData = {
  personalAccessTokenID: string;
  owner?: string;
  name?: string;
  value?: string;
  expiredAt?: string;
};

export type UpdateGithubPATData = Omit<UpdatePATData, 'owner'>;
export type UpdateAzureDevOpsPATData = UpdatePATData;

export type DeletePATData = {
  personalAccessTokenID: string;
};

export type AddRepoData = {
  name: string;
  description?: string;
  namespace: string;
  personalAccessTokenIDs: string[];
};

export type AddGithubRepoData = AddRepoData;
export type AddAzureDevOpsRepoData = AddRepoData;

export type UpdateRepoData = {
  repositoryID: string;
  name?: string;
  description?: string;
};

export type DeleteRepoData = {
  repositoryID: string;
};
