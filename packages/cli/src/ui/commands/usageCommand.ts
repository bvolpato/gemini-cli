/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageType, type HistoryItemUsage } from '../types.js';
import {
  UserAccountManager,
  getG1CreditBalance,
} from '@google/gemini-cli-core';
import {
  type CommandContext,
  type SlashCommand,
  CommandKind,
} from './types.js';

export const usageCommand: SlashCommand = {
  name: 'usage',
  description: 'Show Gemini Code Assist quota and subscription limits',
  kind: CommandKind.BUILT_IN,
  autoExecute: false,
  isSafeConcurrent: true,
  action: async (context: CommandContext) => {
    const selectedAuthType =
      context.services.settings.merged.security.auth.selectedType || '';

    const userAccountManager = new UserAccountManager();
    const cachedAccount = userAccountManager.getCachedGoogleAccount();
    const userEmail = cachedAccount ?? undefined;

    const tier = context.services.agentContext?.config.getUserTierName();
    const paidTier = context.services.agentContext?.config.getUserPaidTier();
    const creditBalance = getG1CreditBalance(paidTier) ?? undefined;
    const currentModel = context.services.agentContext?.config.getModel();

    let quotas;
    let pooledRemaining;
    let pooledLimit;
    let pooledResetTime;
    let quotaToolOutput: string | undefined;

    if (context.services.agentContext?.config) {
      const [quota] = await Promise.all([
        context.services.agentContext.config.refreshUserQuota(),
        context.services.agentContext.config.refreshAvailableCredits(),
      ]);
      if (quota) {
        quotas = quota;
        pooledRemaining =
          context.services.agentContext.config.getQuotaRemaining();
        pooledLimit = context.services.agentContext.config.getQuotaLimit();
        pooledResetTime =
          context.services.agentContext.config.getQuotaResetTime();
      }
    }

    const quotaTool =
      context.services.agentContext?.toolRegistry.getTool('gemini_quota');
    if (quotaTool) {
      try {
        const buildResult = quotaTool.build({});
        if (!Array.isArray(buildResult)) {
          const invocation = buildResult;
          const result = await invocation.execute({
            abortSignal: new AbortController().signal,
          });
          if (Array.isArray(result.llmContent)) {
            quotaToolOutput = result.llmContent
              .map((p: unknown) => {
                if (typeof p === 'object' && p !== null && 'text' in p) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                  return (p as { text: string }).text;
                }
                return '';
              })
              .join('\n');
          } else if (typeof result.llmContent === 'string') {
            quotaToolOutput = result.llmContent;
          } else if (
            result.llmContent &&
            typeof result.llmContent === 'object' &&
            'text' in result.llmContent
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            quotaToolOutput = (result.llmContent as { text: string }).text;
          }
        }
      } catch {
        // Ignore errors during dynamic tool fetch
      }
    }

    context.ui.addItem({
      type: MessageType.USAGE,
      selectedAuthType,
      userEmail,
      tier,
      currentModel,
      creditBalance,
      quotas,
      pooledRemaining,
      pooledLimit,
      pooledResetTime,
      quotaToolOutput,
    } as HistoryItemUsage);
  },
};
