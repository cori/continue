/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type HistoryNode = HistoryNode1;
export type Name = string;
export type Hide = boolean;
export type Description = string;
export type ClassName = string;
export type SystemMessage = string;
export type Role = "assistant" | "user" | "system" | "function";
export type Content = string;
export type Name1 = string;
export type Summary = string;
export type Name2 = string;
export type Arguments = string;
export type ChatContext = ChatMessage[];
export type ManageOwnChatContext = boolean;
export type Depth = number;
export type Deleted = boolean;
export type Active = boolean;
export type Logs = string[];
export type Name3 = string;
export type Description1 = string;
export type ProviderTitle = string;
export type ItemId = string;
export type Content1 = string;
export type Editing = boolean;
export type Editable = boolean;
export type ContextUsed = ContextItem[];

/**
 * A point in history, a list of which make up History
 */
export interface HistoryNode1 {
  step: Step;
  observation?: Observation;
  depth: Depth;
  deleted?: Deleted;
  active?: Active;
  logs?: Logs;
  context_used?: ContextUsed;
  [k: string]: unknown;
}
export interface Step {
  name?: Name;
  hide?: Hide;
  description?: Description;
  class_name?: ClassName;
  system_message?: SystemMessage;
  chat_context?: ChatContext;
  manage_own_chat_context?: ManageOwnChatContext;
  [k: string]: unknown;
}
export interface ChatMessage {
  role: Role;
  content?: Content;
  name?: Name1;
  summary: Summary;
  function_call?: FunctionCall;
  [k: string]: unknown;
}
export interface FunctionCall {
  name: Name2;
  arguments: Arguments;
  [k: string]: unknown;
}
export interface Observation {
  [k: string]: unknown;
}
/**
 * A ContextItem is a single item that is stored in the ContextManager.
 */
export interface ContextItem {
  description: ContextItemDescription;
  content: Content1;
  editing?: Editing;
  editable?: Editable;
  [k: string]: unknown;
}
/**
 * A ContextItemDescription is a description of a ContextItem that is displayed to the user when they type '@'.
 *
 * The id can be used to retrieve the ContextItem from the ContextManager.
 */
export interface ContextItemDescription {
  name: Name3;
  description: Description1;
  id: ContextItemId;
  [k: string]: unknown;
}
/**
 * A ContextItemId is a unique identifier for a ContextItem.
 */
export interface ContextItemId {
  provider_title: ProviderTitle;
  item_id: ItemId;
  [k: string]: unknown;
}
