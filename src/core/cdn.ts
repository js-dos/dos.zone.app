const mapping: {[host: string]: string} = {
    "https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/": "https://cdn.dos.zone/",
};

const mappingKeys = Object.keys(mapping);

export function cdnUrl(bundleUrl: string): string {
    if (bundleUrl === undefined) {
        return undefined as any;
    }

    if (bundleUrl === null) {
        return null as any;
    }

    if (bundleUrl.length === 0) {
        return bundleUrl;
    }

    for (const next of mappingKeys) {
        if (bundleUrl.startsWith(next)) {
            return mapping[next] + bundleUrl.substr(next.length);
        }
    }
    return bundleUrl;
}
