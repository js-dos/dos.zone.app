import { turboRegions } from "./config";

const pingImage = document.createElement("img");

const regionLatency: { [region: string]: number[] } = (() => {
	const latency: { [region: string]: number[] } = {};
	for (const { value } of turboRegions) {
		latency[value] = [];
	}
	return latency;
})();

export async function estimateLatencies() {
	for (let i = 0; i < 10; ++i) {
		for (const { value } of turboRegions) {
			if (value === "auto") {
				continue;
			}
			regionLatency[value].push(await getLatencyForRegionWithImg(value));
		}
	}

	let debugInfo = "";
	for (const next of Object.keys(regionLatency)) {
		if (next === "auto") {
			continue;
		}
		debugInfo += next + ": " + q75(regionLatency[next]) + "\n";
	}
	// tslint:disable-next-line
	console.log("Latency estimation:\n" + debugInfo);
	// tslint:disable-next-line
	console.log("Auto region:", getAutoRegion());
}

function getLatencyForRegionWithImg(region: string) {
	return new Promise<number>((resolve) => {
		const url = "http://dynamodb." + region + ".amazonaws.com/?time=" + Date.now();
		const startedAt = Date.now();
		pingImage.onload = () => {
			resolve(Date.now() - startedAt);
		};
		pingImage.onerror = () => {
			resolve(Date.now() - startedAt);
		};
		pingImage.src = url;
	});
}

function getLatencyForRegionWithXhr(region: string) {
	return new Promise<number>((resolve) => {
		const url = "http://dynamodb." + region + ".amazonaws.com/?time=" + Date.now();
		const xhr = new XMLHttpRequest();

		xhr.open("HEAD", url);
		xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
		xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
		xhr.setRequestHeader("Pragma", "no-cache");

		const startedAt = Date.now();
		xhr.onreadystatechange = function () {
			if (this.readyState === this.DONE) {
				resolve(Date.now() - startedAt);
			}
		};
		xhr.send();
	});
}

export function getAutoRegion() {
	let region = "eu-central-1";
	let minLatency = -1;
	for (const next of Object.keys(regionLatency)) {
		if (next === "auto") {
			continue;
		}
		const latency = q75(regionLatency[next]);
		if (latency > 0 && (minLatency === -1 || minLatency > latency)) {
			region = next;
			minLatency = latency;
		}
	}
	return region;
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

const q75 = (arr: number[]) => quantile(arr, .75);