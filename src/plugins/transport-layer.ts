import { TransportLayer, ClientMessage, MessageHandler, ServerMessage } from "emulators/dist/types/protocol/protocol";
import { HardwareEmulatorPlugin } from "./emulator-plugin";

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core'
import { writeFile } from "capacitor-blob-writer";
import base64 from "base64-js";

const { Filesystem } = Plugins;
declare const realtime: any;

class HardwareTransportLayer implements TransportLayer {
    sessionId: string = Date.now() + "";
    private alive = true;
    private frameWidth = 0;
    private frameHeight = 0;

    private handler: MessageHandler = () => { /**/ };

    callMain() {
        HardwareEmulatorPlugin.sendMessage({ payload: "wc-install\n" + this.sessionId + "\n" });
        requestAnimationFrame(this.update.bind(this));
    }

    async sendMessageToServer(name: ClientMessage, props?: { [key: string]: any; }) {
        if (props === undefined || props?.sessionId !== this.sessionId) {
            return;
        }

        switch (name) {
            case "wc-run": {
                await writeFile({
                    path: "bundle_0.zip",
                    directory: FilesystemDirectory.Data,
                    data: new Blob([props.bundles[0].buffer]),
                    fallback: true,
                });

                if (props.bundles[1] !== undefined) {
                    await writeFile({
                        path: "bundle_1.zip",
                        directory: FilesystemDirectory.Data,
                        data: new Blob([props.bundles[1].buffer]),
                        fallback: true,
                    });
                }

                const payload = "wc-run\n";
                HardwareEmulatorPlugin.sendMessage({ payload });
            } break;
            case "wc-add-key": {
                realtime.addKey(props.key, props.pressed ? 1 : 0, props.timeMs);
            } break;
            case "wc-exit": {
                this.alive = false;
                HardwareEmulatorPlugin.sendMessage({ payload: "wc-exit\n" + this.sessionId + "\n" });
            } break;
            case "wc-mouse-move": {
                realtime.mouseMove(props.x, props.y, props.timeMs);
            } break;
            case "wc-mouse-button": {
                realtime.mouseButton(props.button, props.pressed ? 1 : 0, props.timeMs);
            } break;
            case "wc-pack-fs-to-bundle": {
                HardwareEmulatorPlugin.sendMessage({ payload: "wc-pack-fs-to-bundle\n" + this.sessionId + "\n" });
            } break;
            default: {
                console.log("Unhandled client message (wc):", name, props);
            } break;
        };
    }

    initMessageHandler(handler: MessageHandler) {
        this.handler = handler;
    }

    exit() {
        this.alive = false;
    }

    async onServerMessage(name: string, optProps?: { [key: string]: any }) {
        const props = optProps || {};
        switch (name) {
            case "ws-server-ready": {
                try {
                    const config = await Filesystem.readFile({
                        path: ".jsdos/jsdos.json",
                        directory: FilesystemDirectory.Data,
                        encoding:  FilesystemEncoding.UTF8,
                    });

                    this.handler("ws-config", { sessionId: this.sessionId, content: config.data });
                } catch (e) {
                    this.handler("ws-config", { sessionId: this.sessionId, content: "{}" });
                }
                // delay ws-server-ready until ws-sound-init
            } break;
            case "ws-sound-init": {
                this.handler(name, props);
                this.handler("ws-server-ready", { sessionId: this.sessionId });
            } break;
            case "ws-frame-set-size": {
                this.frameWidth = props.width;
                this.frameHeight = props.height;
                this.handler(name, props);
            } break;
            case "ws-sound-push":
            case "ws-update-lines": {
                console.error(name, "should not be called");
            } break;
            case "ws-persist": {
                props.bundle = decode(props.bundle);
                this.handler(name, props);
            } break;
            case "ws-stdout": {
                // console.log(props);
                this.handler(name, props);
            } break;
            default: {
                this.handler(name as ServerMessage, props);
            }
        }
    }

    private update() {
        if (this.alive) {
            requestAnimationFrame(this.update.bind(this));
        }
        this.updateFrame();
    }

    private updateFrame() {
        if (this.frameWidth === 0 || this.frameHeight === 0) {
            return;
        }

        const framePayload = realtime.getFramePayload();
        if (framePayload.length === 0) {
            return;
        }

        const framePayloadU8 = decode(framePayload);
        if (framePayloadU8.length === 0) {
            return;
        }

        const lines: {
            start: number,
            heapu8: Uint8Array,
        }[] = [];

        const pitch = this.frameWidth * 3;
        let offset = this.frameHeight;
        let upBorder: number = -1;
        for (let line = 0; line < this.frameHeight; ++line) {
            const lastLine = line === this.frameHeight - 1;


            if (framePayloadU8[line] === 1 && upBorder === -1){
                upBorder = line;
            } else if ((lastLine || framePayloadU8[line] === 0) && upBorder !== -1) {
                const downBorder = framePayloadU8[line] === 1 ? line : line - 1;
                const range = (downBorder - upBorder + 1) * pitch;
                const heapu8 = framePayloadU8.slice(offset, offset + range);
                lines.push({
                    start: upBorder,
                    heapu8,
                });
                offset += range;
                upBorder = -1;
            }
        }

        this.handler("ws-update-lines", {
            sessionId: this.sessionId,
            lines,
        });
    }
}


export class HardwareTransportLayerFactory {
    private serverMessageHandler: (name: string, props?: { [key: string]: any }) => void = () => { /**/ };

    constructor() {
        const plugin = (HardwareEmulatorPlugin as any);
        if (typeof plugin.addListener !== "undefined") {
            plugin.addListener("serverMessage", (payload: { json: string }) => {
                if (payload.json.indexOf("ws-stdout") !== -1) {
                    payload.json = payload.json.replace(/\n/g, "\\n");
                }

                try {
                    const data = JSON.parse("{" + payload.json.slice(0, -1) + "}");
                    this.serverMessageHandler(data.name, data);
                } catch (e) {
                    console.error("Can't parse", payload.json, e);
                    throw e;
                }
            });
        }
    }

    canIUse(): Promise<{ ok: boolean }> {
        return HardwareEmulatorPlugin.canIUse();
    }

    createTransportLayer = () => {
        const transport = new HardwareTransportLayer();
        this.serverMessageHandler = transport.onServerMessage.bind(transport);
        transport.callMain();
        return transport;
    }
}


export const hardwareTransportLayerFactory = new HardwareTransportLayerFactory();

function decode(input: string): Uint8Array {
    return base64.toByteArray(input);
}
