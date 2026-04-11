/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import type { QuotaStats } from '../types.js';

interface UsageDisplayProps {
  selectedAuthType?: string;
  userEmail?: string;
  tier?: string;
  currentModel?: string;
  creditBalance?: number;
  quotaStats?: QuotaStats;
  quotaToolOutput?: string;
}

export const UsageDisplay: React.FC<UsageDisplayProps> = ({
  selectedAuthType,
  userEmail,
  tier,
  currentModel,
  creditBalance,
  quotaStats,
  quotaToolOutput,
}) => (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.text.primary}
      paddingX={2}
      paddingY={1}
      width="100%"
    >
      <Box marginBottom={1}>
        <Text bold color={theme.text.primary}>
          Gemini Account Usage & Limits
        </Text>
      </Box>

      {selectedAuthType && (
        <Box>
          <Box width={16}>
            <Text>Auth Method:</Text>
          </Box>
          <Box>
            <Text color={theme.text.primary}>
              {selectedAuthType} {userEmail ? `(${userEmail})` : ''}
            </Text>
          </Box>
        </Box>
      )}

      {tier && (
        <Box>
          <Box width={16}>
            <Text>Tier:</Text>
          </Box>
          <Box>
            <Text color={theme.text.primary}>{tier}</Text>
          </Box>
        </Box>
      )}

      {creditBalance !== undefined && (
        <Box>
          <Box width={16}>
            <Text>AI Credits:</Text>
          </Box>
          <Box>
            <Text color={theme.text.primary}>{creditBalance}</Text>
          </Box>
        </Box>
      )}

      {currentModel && (
        <Box>
          <Box width={16}>
            <Text>Model:</Text>
          </Box>
          <Box>
            <Text color={theme.text.primary}>{currentModel}</Text>
          </Box>
        </Box>
      )}

      {quotaToolOutput && (
        <Box marginTop={1} flexDirection="column">
          <Text>{quotaToolOutput}</Text>
        </Box>
      )}

      {!quotaToolOutput && quotaStats && (
        <Box marginTop={1} flexDirection="column">
          <Box marginBottom={1}>
            <Text underline>Quota Limit</Text>
          </Box>
          <Box>
            <Box width={16}>
              <Text>Remaining:</Text>
            </Box>
            <Box>
              <Text color={theme.text.primary}>
                {quotaStats.remaining !== undefined
                  ? quotaStats.remaining
                  : 'N/A'}
              </Text>
            </Box>
          </Box>
          <Box>
            <Box width={16}>
              <Text>Limit:</Text>
            </Box>
            <Box>
              <Text color={theme.text.primary}>
                {quotaStats.limit !== undefined ? quotaStats.limit : 'N/A'}
              </Text>
            </Box>
          </Box>
          {quotaStats.resetTime && (
            <Box>
              <Box width={16}>
                <Text>Reset Time:</Text>
              </Box>
              <Box>
                <Text color={theme.text.primary}>{quotaStats.resetTime}</Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
