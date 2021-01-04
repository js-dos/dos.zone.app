import { HEAD } from "./xhr/GET";
import { uploadsPersonalBase, uploadsS3Url} from "./config";


export async function getPersonalBundleUrl(email: string, bundleUrl: string): Promise<string> {
    const index = bundleUrl.lastIndexOf("/");
    const basename = bundleUrl.substr(index + 1);
    const personalBundleKey = uploadsPersonalBase + "/" + email + "/" + basename;
    const personalBundleUrl = uploadsS3Url + "/" + personalBundleKey;

    try {
        await HEAD(personalBundleUrl);
        return personalBundleUrl;
    } catch (e) {
        return bundleUrl;
    }
}

