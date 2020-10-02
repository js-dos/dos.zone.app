function _GET(url: string,
              responseType: XMLHttpRequestResponseType,
              onprogress?: (progress: number) => void): Promise<string | ArrayBuffer> {
    return new Promise<string>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.responseType = responseType;
        request.open("get", url, true);

        request.addEventListener("load", () => {
            if (responseType === "text") {
                resolve(request.responseText);
            } else if (responseType === "arraybuffer") {
                resolve(request.response);
            } else {
                reject("Unsupported responseType " + responseType);
            }
        }, false);
        request.addEventListener("error", (arg1: any) => {
            reject("HTTP GET failed for url " + url);
        }, false);
        request.addEventListener("abort", () => {
            reject("HTTP GET canceled for url " + url);
        }, false);
        request.onprogress = (event) => {
            const porgress = Math.round(event.loaded * 10000 / event.total) / 100;
            if (onprogress !== undefined) {
                onprogress(porgress);
            }
        };

        request.send();
    });
}

export async function GET_OBJECT(url: string,
                    onprogress?: (progress: number) => void): Promise<any> {
    const response = JSON.parse(await (_GET(url, "text", onprogress) as Promise<string>));
    if (response.success) {
        return response;
    }

    throw new Error("GET Request failed:\n Payload:\n" + JSON.stringify(response.body, null, 2));
}

export function GET_BUFFER(url: string,
                           onprogress?: (progress: number) => void): Promise<ArrayBuffer> {
    return _GET(url, "arraybuffer", onprogress) as Promise<ArrayBuffer>;
}
