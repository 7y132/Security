import { slashOptions } from "knub";
import { actualMassKickCmd } from "./actualMassKickCmd";
import { generateAttachmentSlashOptions, retrieveMultipleOptions } from "../../../../utils/multipleSlashOptions";
import { NUMBER_ATTACHMENTS_CASE_CREATION } from "../constants";
import { slashCmdReasonAliasAutocomplete } from "../../functions/slashCmdReasonAliasAutocomplete";
import { modActionsSlashCmd } from "../../types";
import { GuildMember } from "discord.js";

const opts = [
  {
    ...slashOptions.string({ name: "reason", description: "The reason", required: false }),
    getExtraAPIProps: () => ({
      autocomplete: true,
    }),
  },
  ...generateAttachmentSlashOptions(NUMBER_ATTACHMENTS_CASE_CREATION, {
    name: "attachment",
    description: "An attachment to add to the reason",
  }),
];

export function MassKickSlashCmdAutocomplete({ pluginData, interaction }) {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name !== "reason") {
    interaction.respond([]);
    return;
  }

  slashCmdReasonAliasAutocomplete({ pluginData, interaction });
}

export const MassKickSlashCmd = modActionsSlashCmd({
  name: "masskick",
  configPermission: "can_masskick",
  description: "Mass-kick a list of user IDs",
  allowDms: false,

  signature: [
    slashOptions.string({ name: "user-ids", description: "The list of user IDs to kick", required: true }),

    ...opts,
  ],

  async run({ interaction, options, pluginData }) {
    await interaction.deferReply({ ephemeral: true });
    const attachments = retrieveMultipleOptions(NUMBER_ATTACHMENTS_CASE_CREATION, options, "attachment");

    if ((!options.reason || options.reason.trim() === "") && attachments.length < 1) {
      pluginData.state.common.sendErrorMessage(interaction, "Text or attachment required", undefined, undefined, true);

      return;
    }

    actualMassKickCmd(
      pluginData,
      interaction,
      options["user-ids"].split(/[\s,\r\n]+/),
      interaction.member as GuildMember,
      options.reason || "",
      attachments,
    );
  },
});
