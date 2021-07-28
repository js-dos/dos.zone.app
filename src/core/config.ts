export const publicUrl = process.env.PUBLIC_URL;

export const uploadsS3Url = "https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com";
export const uploadsPersonalBase = "personal";

const endpointBase = "https://mjaoyuabnd.execute-api.eu-central-1.amazonaws.com/dev";

export const ssoUrl = endpointBase + "/sso/url";
export const ssoLogin = endpointBase + "/sso/login";
export const ssoLogout = endpointBase + "/sso/logout";

export const turboRegions = [
	{label: "Automatic", value: "auto"},
	{label: "US East (N. Virginia)", value: "us-east-1"},
	{label: "US East (Ohio)", value: "us-east-2"},
	{label: "US West (N. California)", value: "us-west-1"},
	{label: "US West (Oregon)", value: "us-west-2"},
	{label: "Europe (Frankfurt)", value: "eu-central-1"},
	{label: "Europe (Ireland)", value: "eu-west-1"},
	{label: "Europe (London)", value: "eu-west-2"},
	{label: "Europe (Milan)", value: "eu-south-1"},
	{label: "Europe (Paris)", value: "eu-west-3"},
	{label: "Europe (Stockholm)", value: "eu-north-1"},
	{label: "Asia Pacific (Hong Kong)", value: "ap-east-1"},
	{label: "Asia Pacific (Mumbai)", value: "ap-south-1"},
	{label: "Asia Pacific (Osaka)", value: "ap-northeast-3"},
	{label: "Asia Pacific (Seoul)", value: "ap-northeast-2"},
	{label: "Asia Pacific (Singapore)", value: "ap-southeast-1"},
	{label: "Asia Pacific (Sydney)", value: "ap-southeast-2"},
	{label: "Asia Pacific (Tokyo)", value: "ap-northeast-1"},
	{label: "Canada", value: "ca-central-1"},
	{label: "Middle East (Bahrain)", value: "me-south-1"},
	{label: "South America (São Paulo)", value: "sa-east-1"},
	{label: "Africa (Cape Town)", value: "af-south-1"},
];

export const turboLimits = endpointBase + "/turbo/limits";
export const turboConnect = endpointBase + "/turbo/connect";
export const turboDisconnect = endpointBase + "/turbo/disconnect";
export const turboDescribe = endpointBase + "/turbo/describe";

export const storageGet = endpointBase + "/storage/get";
export const storagePut = endpointBase + "/storage/put";

export const gameGet = endpointBase + "/game/get";
export const gameSearch = endpointBase + "/game/search";
export const inappGet = endpointBase + "/inapp/get";

export const perosnalPut = endpointBase + "/personal/put";
export const personalAcl = endpointBase + "/personal/acl";
