import { guildPluginMessageCommand } from "knub";
import { setAntiraidLevel } from "../functions/setAntiraidLevel";
import { AutomodPluginType } from "../types";

export const AntiraidClearCmd = guildPluginMessageCommand<AutomodPluginType>()({
  trigger: ["antiraid clear", "antiraid reset", "antiraid none", "antiraid off"],
  permission: "can_set_antiraid",

  async run({ pluginData, message }) {
    await setAntiraidLevel(pluginData, null, message.author);
    void pluginData.state.common.sendSuccessMessage(message, "Anti-raid turned **off**");
  },
});
