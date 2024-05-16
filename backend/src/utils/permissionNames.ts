import type { PermissionFlagsBits } from "discord.js";
import { EMPTY_CHAR } from "../utils";

export const PERMISSION_NAMES = {
  AddReactions: "Add Reactions",
  Administrator: "Administrator",
  AttachFiles: "Attach Files",
  BanMembers: "Ban Members",
  ChangeNickname: "Change Nickname",
  Connect: "Connect",
  CreateEvents: "Create Events",
  CreateGuildExpressions: "Create Guild Expressions",
  CreateInstantInvite: "Create Invite",
  CreatePrivateThreads: "Create Private Threads",
  CreatePublicThreads: "Create Public Threads",
  DeafenMembers: "Deafen Members",
  EmbedLinks: "Embed Links",
  KickMembers: "Kick Members",
  ManageChannels: "Manage Channels",
  ManageEmojisAndStickers: "Manage Emojis and Stickers",
  ManageGuild: "Manage Server",
  ManageMessages: "Manage Messages",
  ManageNicknames: "Manage Nicknames",
  ManageRoles: "Manage Roles",
  ManageThreads: "Manage Threads",
  ManageWebhooks: "Manage Webhooks",
  MentionEveryone: `Mention @${EMPTY_CHAR}everyone, @${EMPTY_CHAR}here, and All Roles`,
  MoveMembers: "Move Members",
  MuteMembers: "Mute Members",
  PrioritySpeaker: "Priority Speaker",
  ReadMessageHistory: "Read Message History",
  RequestToSpeak: "Request to Speak",
  SendMessages: "Send Messages",
  SendMessagesInThreads: "Send Messages in Threads",
  SendPolls: "Send Polls",
  SendTTSMessages: "Send Text-To-Speech Messages",
  Speak: "Speak",
  Stream: "Video",
  UseApplicationCommands: "Use Application Commands",
  UseEmbeddedActivities: "Start Embedded Activities",
  UseExternalEmojis: "Use External Emoji",
  UseExternalStickers: "Use External Stickers",
  UseVAD: "Use Voice Activity",
  ViewAuditLog: "View Audit Log",
  ViewChannel: "View Channels",
  ViewGuildInsights: "View Guild Insights",
  ModerateMembers: "Moderate Members",
  ManageEvents: "Manage Events",
  ManageGuildExpressions: "Manage Expressions",
  SendVoiceMessages: "Send Voice Messages",
  UseExternalSounds: "Use External Sounds",
  UseSoundboard: "Use Soundboard",
  ViewCreatorMonetizationAnalytics: "View Creator Monetization Analytics",
} as const satisfies Record<keyof typeof PermissionFlagsBits, string>;
