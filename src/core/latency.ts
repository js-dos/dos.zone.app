import { turboRegions } from "./config";

const timeoutMs = 500;
const latencyCheckMethod = getLatencyForRegionWithImg;

const regionLatency: { [region: string]: number[] } = (() => {
	const latency: { [region: string]: number[] } = {};
	for (const { value } of turboRegions) {
		latency[value] = [];
	}
	return latency;
})();

export async function getAutoRegion(onLatencyUpdate: (region: string) => void) {
	const regions = [...turboRegions];
	regions.shift(); // remove auto region

	const blackListedRegions: { [region: string]: boolean } = {};

	// estimation
	for (const { value } of regions) {
		for (let i = 0; i < 5; ++i) {
			if (blackListedRegions[value] === true) {
				continue;
			}
			regionLatency[value].push(await latencyCheckMethod(value).catch(() => {
				blackListedRegions[value] = true;
				return 9999;
			}));
			onLatencyUpdate(value + " (" + min(regionLatency[value]) + " ms)");
		}
	}

	let region = "eu-central-1";
	let minLatency = -1;
	let debugInfo = "";
	for (const next of Object.keys(regionLatency)) {
		if (blackListedRegions[next]) {
			debugInfo += next + ": blacklisted\n";
		} else {
			const latency = min(regionLatency[next]);
			if (latency > 0 && (minLatency === -1 || minLatency > latency)) {
				region = next;
				minLatency = latency;
			}
			debugInfo += next + ": " + latency + "\n";
		}
	}
	// tslint:disable-next-line
	console.log("Latency estimation:\n" + debugInfo);
	// tslint:disable-next-line
	console.log("Auto region:", region);


	return region;
}

const pingImage = document.createElement("img");
function getLatencyForRegionWithImg(region: string) {
	return new Promise<number>((resolve, reject) => {
		const url = "http://dynamodb." + region + ".amazonaws.com/?time=" + Date.now();
		let startedAt = 0;
		let timeoutId: any = 0;
		pingImage.onload = () => {
			resolve(Date.now() - startedAt);
			clearTimeout(timeoutId);
		};
		pingImage.onerror = () => {
			resolve(Date.now() - startedAt);
			clearTimeout(timeoutId);
		};
		timeoutId = setTimeout(() => {
			reject();
			pingImage.src = "";
		}, timeoutMs);
		startedAt = Date.now();
		pingImage.src = url;
	});
}

function getLatencyForRegionWithXhr(region: string) {
	return new Promise<number>((resolve, reject) => {
		const url = "http://dynamodb." + region + ".amazonaws.com/?time=" + Date.now();
		const xhr = new XMLHttpRequest();

		let startedAt = 0;
		xhr.timeout = timeoutMs;
		xhr.ontimeout = () => {
			reject();
		};
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.OPENED) {
				startedAt = Date.now();
				xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
				xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
				xhr.setRequestHeader("Pragma", "no-cache");
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				resolve(Date.now() - startedAt);
			}
		};

		xhr.open("OPTIONS", url);
		xhr.send();
	});
}

const quantile = (arr: number[], q: number) => {
	const sorted = asc(arr);
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	if (sorted[base + 1] !== undefined) {
		return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
	} else {
		return sorted[base];
	}
};

const asc = (arr: number[]) => arr.sort((a, b) => a - b);

const min = (arr: number[]) => {
	if (arr.length === 0) {
		return 0;
	}

	return asc(arr)[0];
};

const q75 = (arr: number[]) => quantile(arr, .75);