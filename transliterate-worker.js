import { EwtsConverter } from "./lib/EwtsConverter.mjs";
const ewts = new EwtsConverter({
  leave_dubious: false,
  pass_through: false
});

onmessage = async function (event) {
  const { content, toUnicode } = event.data;
  const port = event.ports[0];
  port.postMessage(
    toUnicode ? ewts.to_unicode(content) : ewts.to_ewts(content)
  );
};
