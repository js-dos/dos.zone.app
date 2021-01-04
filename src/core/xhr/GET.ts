function _SEND(method: "get" | "post" | "head",
               url: string,
               responseType: XMLHttpRequestResponseType,
               body?: string,
               onprogress?: (progress: number) => void): Promise<string | ArrayBuffer> {
    return new Promise<string>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.responseType = responseType;
        request.open(method, url, true);

        request.addEventListener("load", () => {
            if (request.status !== 200) {
                reject("Wrong status code " + request.status);
            } else if (responseType === "text") {
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

        request.send(body);
    });
}

function _GET(url: string,
              responseType: XMLHttpRequestResponseType,
              onprogress?: (progress: number) => void): Promise<string | ArrayBuffer> {
    return _SEND("get", url, responseType, undefined, onprogress);
}

function _POST(url: string,
               responseType: XMLHttpRequestResponseType,
               data: string): Promise<string | ArrayBuffer> {
    return _SEND("post", url, responseType, data);
}

export async function GET_OBJECT(url: string,
                                 onprogress?: (progress: number) => void): Promise<any> {
    const response = JSON.parse(await (_GET(url, "text", onprogress) as Promise<string>));
    if (response.success) {
        return response;
    }

    throw new Error("GET Request failed:\n Payload:\n" + JSON.stringify(response.body, null, 2));
}

export async function POST_OBJECT(url: string, data: string): Promise<any> {
    const response = JSON.parse(await (_POST(url, "text", data) as Promise<string>));
    if (response.success) {
        return response;
    }

    throw new Error("POST Request failed:\n Payload:\n" + JSON.stringify(response.body, null, 2));
}

export function GET_TEXT(url: string): Promise<string> {
    return _GET(url, "text") as Promise<string>;
}

export function GET_BUFFER(url: string,
                           onprogress?: (progress: number) => void): Promise<ArrayBuffer> {
    return _GET(url, "arraybuffer", onprogress) as Promise<ArrayBuffer>;
}

export function HEAD(url: string) {
    return _SEND("head", url, "text");
}
