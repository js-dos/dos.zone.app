import React, {
    useEffect,
    useState
} from "react";

import {
    useParams,
    Redirect,
} from "react-router-dom";

import { Spinner } from "@blueprintjs/core";

import { parseQuery } from "./query-string";
import { authenticate, User } from "./auth";

export function Deeplink(props: {
    setUser: (user: User | null) => void,
}) {
    const { lang, url } = useParams<{ lang: string, url: string }>();
    const [ decodedUrl, setDecodedUrl ] = useState<string | null>(null);
    const setUser = props.setUser;

    useEffect(() => {
        let cancel = false;
        const decoded = atob(url);
        const queryIndex = decoded.indexOf("?");
        const queryParams = queryIndex > 0 ? parseQuery(decoded.substr(queryIndex)) : {};

        const sso = queryParams.sso;
        const sig = queryParams.sig;

        if (sso && sig) {
            authenticate(sso, sig).then((user) => {
                if (cancel) {
                    return;
                }

                setUser(user);
                setDecodedUrl("/");
            });
        } else {
            setDecodedUrl(decoded);
        }

        return () => {
            cancel = true;
        }
    }, [url, setUser]);


    if (decodedUrl === null) {
        return <Spinner/>;
    }

    const myIndex = decodedUrl.indexOf("/my/");
    if (myIndex > 0) {
        const bundleUrl =  decodedUrl.substr(myIndex + "/my/".length);
        const newUrl = "/" + lang + "/my/" + bundleUrl;
        return <Redirect to={newUrl}></Redirect>;
    }

    return <Redirect to={"/" + lang}></Redirect>;
}
