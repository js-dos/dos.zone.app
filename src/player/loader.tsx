import React from "react";

export function Loader(props: { pre2: string }) {
    return  <div className="loader-container">
        <pre className="loader-pre-1">
            {pre1}
        </pre>
        <pre className="loader-pre-2">
            {props.pre2}
        </pre>
        <div className="loader-icon">
        </div>
    </div>;
}

const pre1 = `
        _                __
       (_)____      ____/ /___  _____ _________  ____ ___
      / / ___/_____/ __  / __ \\/ ___// ___/ __ \\/ __ \`__ \\
     / (__  )_____/ /_/ / /_/ (__  )/ /__/ /_/ / / / / / /
  __/ /____/      \\__,_/\\____/____(_)___/\\____/_/ /_/ /_/
 /___/
`;
