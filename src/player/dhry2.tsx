import React, { useEffect, useState } from "react";
import { CommandInterface } from "emulators";

export function Dhry2(props: {
    ci: CommandInterface,
}) {
    const ci = props.ci;
    const [tokens, setTokens] = useState<string[]>([]);

    useEffect(() => {
        const time = [0, 0];
        let timeIndex = 0;
        let runs = 10000;
        // listen program outpus for `~>dtime` marker
        ci.events().onStdout((message) => {
            if (message.indexOf("~>dtime") === -1) {
                return;
            }

            time[timeIndex++] = performance.now();
            if (timeIndex === 2) {
                const delta = Math.round((time[1] - time[0]) * 10) / 10;
                const vaxRating = runs * 1000  / delta / 1757;
                setTokens([
                    "Runs: ", runs + "",
                    "Time: ", delta + "", " ms",
                    "VAX : ", Math.round(vaxRating * 10) / 10 + "",
                ]);
                runs *= 2;
                timeIndex = 0;

                if (delta > 3000) {
                    setTokens([
                        "Runs: ", runs + "",
                        "Time: ", delta + "", " ms",
                        "VAX : ", Math.round(vaxRating * 10) / 10 + "",
                        "PC: ", getComparablePc(vaxRating),
                    ]);

                    // properly exit
                    ci.exit();
                }
            }
        });
    }, [ci]);

    return <div className="dhry2-test">
        <h1>Dhrystone Benchmark</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <p>{tokens[0] || ""} <span style={{color: "#15B371"}}>{tokens[1] || ""}</span></p>
            <p>{tokens[2] || ""} <span style={{color: "#15B371"}}>{tokens[3] || ""}</span>{tokens[4] || ""}</p>
            <p>{tokens[5] || ""} <span style={{color: "#15B371"}}>{tokens[6] || ""}</span></p>
        </div>
        {tokens[7] ? <p style={{textAlign: "center"}}>{tokens[7]}<span style={{color: "#FFC940"}}>{tokens[8] || "..."}</span></p> : null }
    </div>;
}

function getComparablePc(vax: number): string {
    let index = 0;
    while ((index * 2 + 1) < results.length) {
        if (results[index * 2 + 1] >= vax) {
            break;
        }

        index++;
    }

    index = Math.min((results.length / 2 - 1), index);
    return (results[index * 2] + "").trim();
}

// Reuslts from
// http://www.roylongbottom.org.uk/dhrystone%20results.htm
const results = [
    "AMD 80386 40MHz", 13.7,
    "IBM 486D2 50MHz", 22.4,
    "80486 DX2 66MHz", 35.3,
    "IBM 486BL 100MHz", 40.9,
    "AMD 5X86 133MHz", 84.5,
    "Pentium 75MHz", 87.1,
    "Cyrix P150 120MHz", 160,
    "Pentium 100MHz", 122,
    "Cyrix PP166 133MHz", 180,
    "IBM 6x86 150MHz", 188,
    "Pentium 133MHz", 181,
    "Pentium 166MHz", 189,
    "Cyrix PR233 188MHz", 232,
    "Pentium 200MHz", 269,
    "Pentium MMX 200MHz", 276,
    "AMD K6 200MHz", 289,
    "Pentium Pro 200MHz", 312,
    "Celeron A 300MHz", 484,
    "Pentium II 300MHz", 477,
    "AMD K62 500MHz", 606,
    "AMD K63 450MHz", 645,
    "Pentium II 450MHz", 713,
    "Celeron A 450MHz", 720,
    "Pentium III 450MHz", 722,
    "Pentium III 600MHz", 959,
    "Athlon 600MHz", 942,
    "Duron 600MHz", 999,
    "Pentium III 1000MHz", 1595,
    "PIII Tualatin 1200MHz", 1907,
    "Pentium 4 1700MHz", 1843,
    "Athlon Tbird 1000MHz", 1659,
    "Duron 1000MHz", 1674,
    "Celeron M 1295MHz", 2273,
    "Atom 1600MHz", 1828,
    "Pentium 4 1900MHz", 2003,
    "Atom 1666MHz", 1948,
    "P4 Xeon 2200MHz", 2265,
    "Atom Z8300 1840MHz", 2686,
    "Athlon 4 1600MHz", 2830,
    "Pentium M 1862MHz", 3933,
    "Ath4 Barton 1800MHz", 3172,
    "Pentium 4E 3000MHz", 3553,
    "Athlon XP 2080MHz", 3700,
    "Turion 64 M 1900MHz", 3742,
    "Pentium 4 3066MHz", 4012,
    "Opteron 1991MHz", 3985,
    "Core 2 Duo M 1830MHz", 4952,
    "Athlon XP 2338MHz", 4160,
    "Athlon 64 2150MHz", 4288,
    "Pentium 4 3678MHz", 4227,
    "Athlon 64 2211MHz", 4462,
    "Celeron C2 M 2000MHz", 5275,
    "Core 2 Duo 1 CP 2400MHz", 6446,
    "Core i5 2467M 2300MHz", 4752,
    "Phenom II 1 CP 3000MHz", 7615,
    "Core i7 930 3066MHz", 8684,
    "Core i7 860 3460MHz", 9978,
    "Core i7 3930K 3800MHz", 11197,
    "Core i7 4820K 3900MHz", 11867,
    "Core i7 4820K 3900MHz", 11978,
    "Core i7 3930K", 13877,
];
