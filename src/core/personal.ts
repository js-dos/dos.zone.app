import { HEAD, POST_OBJECT, SEND } from "./xhr/GET";
import { uploadsPersonalBase, uploadsS3Url, perosnalPut, personalAcl } from "./config";
import { User } from "./auth";

export function getPersonalBundleUrl(email: string, bundleUrl: string): string {
    const index = bundleUrl.lastIndexOf("/");
    const basename = bundleUrl.substr(index + 1);
    const personalBundleKey = uploadsPersonalBase + "/" + email + "/" + basename;
    return uploadsS3Url + "/" + personalBundleKey;
}

export async function getPersonalBundleUrlIfExists(email: string, bundleUrl: string): Promise<string> {
    const personalBundleUrl = getPersonalBundleUrl(email, bundleUrl);

    try {
        await HEAD(personalBundleUrl);
        return personalBundleUrl;
    } catch (e) {
        return bundleUrl;
    }
}

export async function putPresonalBundle(user: User, data: Uint8Array, bundleUrl: string) {
    const personalUrl = getPersonalBundleUrl(user.email, bundleUrl);
    const result = await POST_OBJECT(perosnalPut + "?sso=" + user.sso + "&sig=" + user.sig +
        "&bundleUrl=" + encodeURIComponent(personalUrl));

    if (!result.success) {
        throw new Error("Unable to put personal bundle");
    }

    const payload = JSON.parse(result.payload);
    const headers = payload.signature as {[name: string]: string};
    const url = payload.url as string;

    headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
    await SEND("put",
               url,
               "text",
               data.buffer,
               undefined,
               headers);

    if (!(await POST_OBJECT(personalAcl + "?sso=" + user.sso + "&sig=" + user.sig +
        "&bundleUrl=" + personalUrl)).success) {
        throw new Error("Can't set ACL to persona bundle");
    }
}
