declare const zip: any;

export function ZipExecutables(zipBlob: Blob) {
    return new Promise<string[]>((resolve, reject) => {
        const outcome: string[] = [];
        zip.createReader(new zip.BlobReader(zipBlob), (reader: any) => {
            reader.getEntries((entries: any) => {
                for (const entry of entries) {
                    const filename: string = entry.filename;
                    if (filename.toLocaleLowerCase().endsWith(".com") ||
                        filename.toLocaleLowerCase().endsWith(".exe") ||
                        filename.toLocaleLowerCase().endsWith(".bat")) {
                        outcome.push(filename);
                    }
                }

                reader.close();
                resolve(outcome);
            });
        }, (e: any) => {
            reject(e);
        });
    });

}
