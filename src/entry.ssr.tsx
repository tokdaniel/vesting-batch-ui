import { renderToString, type RenderOptions } from "@builder.io/qwik/server";
import { App } from "./app";

export default function (opts: RenderOptions) {
  return renderToString(<App />, opts);
}
