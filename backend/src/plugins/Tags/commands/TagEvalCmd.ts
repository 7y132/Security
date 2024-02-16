import { MessageCreateOptions } from "discord.js";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { TemplateParseError } from "../../../templateFormatter";
import { memberToTemplateSafeMember, userToTemplateSafeUser } from "../../../utils/templateSafeObjects";
import { CommonPlugin } from "../../Common/CommonPlugin";
import { tagsCmd } from "../types";
import { renderTagBody } from "../util/renderTagBody";

export const TagEvalCmd = tagsCmd({
  trigger: "tag eval",
  permission: "can_create",

  signature: {
    body: ct.string({ catchAll: true }),
  },

  async run({ message: msg, args, pluginData }) {
    try {
      const rendered = (await renderTagBody(
        pluginData,
        args.body,
        [],
        {
          member: memberToTemplateSafeMember(msg.member),
          user: userToTemplateSafeUser(msg.member.user),
        },
        { member: msg.member },
      )) as MessageCreateOptions;

      if (!rendered.content && !rendered.embeds?.length) {
        pluginData.getPlugin(CommonPlugin).sendErrorMessage(msg, "Evaluation resulted in an empty text");
        return;
      }

      msg.channel.send(rendered);
    } catch (e) {
      if (e instanceof TemplateParseError) {
        pluginData.getPlugin(CommonPlugin).sendErrorMessage(msg, `Failed to render tag: ${e.message}`);
        return;
      }

      throw e;
    }
  },
});
