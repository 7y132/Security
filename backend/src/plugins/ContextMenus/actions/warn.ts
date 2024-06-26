import {
  ActionRowBuilder,
  ButtonInteraction,
  ContextMenuCommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { GuildPluginData } from "knub";
import { logger } from "../../../logger";
import { canActOn } from "../../../pluginUtils";
import { renderUserUsername } from "../../../utils";
import { CaseArgs } from "../../Cases/types";
import { ModActionsPlugin } from "../../ModActions/ModActionsPlugin";
import { MODAL_TIMEOUT } from "../commands/ModMenuUserCtxCmd";
import { ContextMenuPluginType, ModMenuActionType } from "../types";
import { updateAction } from "./update";

async function warnAction(
  pluginData: GuildPluginData<ContextMenuPluginType>,
  reason: string,
  evidence: string | undefined,
  target: string,
  interaction: ButtonInteraction | ContextMenuCommandInteraction,
  submitInteraction: ModalSubmitInteraction,
) {
  const interactionToReply = interaction.isButton() ? interaction : submitInteraction;
  const executingMember = await pluginData.guild.members.fetch(interaction.user.id);
  const userCfg = await pluginData.config.getMatchingConfig({
    channelId: interaction.channelId,
    member: executingMember,
  });

  const modactions = pluginData.getPlugin(ModActionsPlugin);
  if (!userCfg.can_use || !(await modactions.hasWarnPermission(executingMember, interaction.channelId))) {
    await interactionToReply.editReply({
      content: "Cannot warn: insufficient permissions",
      embeds: [],
      components: [],
    });
    return;
  }

  const targetMember = await pluginData.guild.members.fetch(target);
  if (!canActOn(pluginData, executingMember, targetMember)) {
    await interactionToReply.editReply({
      content: "Cannot warn: insufficient permissions",
      embeds: [],
      components: [],
    });
    return;
  }

  const caseArgs: Partial<CaseArgs> = {
    modId: executingMember.id,
  };

  const result = await modactions.warnMember(reason, reason, targetMember.user, targetMember, { caseArgs });
  if (result.status === "failed") {
    await interactionToReply.editReply({ content: "Error: Failed to warn user", embeds: [], components: [] });
    return;
  }

  const userName = renderUserUsername(targetMember.user);
  const messageResultText = result.notifyResult.text ? ` (${result.notifyResult.text})` : "";
  const muteMessage = `Warned **${userName}** (Case #${result.case.case_number})${messageResultText}`;

  if (evidence) {
    await updateAction(pluginData, executingMember, result.case, evidence);
  }

  await interactionToReply.editReply({ content: muteMessage, embeds: [], components: [] });
}

export async function launchWarnActionModal(
  pluginData: GuildPluginData<ContextMenuPluginType>,
  interaction: ButtonInteraction | ContextMenuCommandInteraction,
  target: string,
) {
  const modalId = `${ModMenuActionType.WARN}:${interaction.id}`;
  const modal = new ModalBuilder().setCustomId(modalId).setTitle("Warn");
  const reasonIn = new TextInputBuilder().setCustomId("reason").setLabel("Reason").setStyle(TextInputStyle.Paragraph);
  const evidenceIn = new TextInputBuilder()
    .setCustomId("evidence")
    .setLabel("Evidence (Optional)")
    .setRequired(false)
    .setStyle(TextInputStyle.Paragraph);
  const reasonRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonIn);
  const evidenceRow = new ActionRowBuilder<TextInputBuilder>().addComponents(evidenceIn);
  modal.addComponents(reasonRow, evidenceRow);

  await interaction.showModal(modal);
  await interaction
    .awaitModalSubmit({ time: MODAL_TIMEOUT, filter: (i) => i.customId == modalId })
    .then(async (submitted) => {
      if (interaction.isButton()) {
        await submitted.deferUpdate().catch((err) => logger.error(`Warn interaction defer failed: ${err}`));
      } else if (interaction.isContextMenuCommand()) {
        await submitted.deferReply({ ephemeral: true });
      }

      const reason = submitted.fields.getTextInputValue("reason");
      const evidence = submitted.fields.getTextInputValue("evidence");

      await warnAction(pluginData, reason, evidence, target, interaction, submitted);
    });
}
