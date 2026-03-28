import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock('@aws-sdk/lib-dynamodb', () => {
  // Use a class for GetCommand mock
  class MockGetCommand {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  class MockUpdateCommand {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  class MockQueryCommand {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  return {
    DynamoDBClient: vi.fn(),
    DynamoDBDocumentClient: {
      from: vi.fn(() => ({
        send: mockSend,
      })),
    },
    GetCommand: MockGetCommand,
    UpdateCommand: MockUpdateCommand,
    QueryCommand: MockQueryCommand,
  };
});

vi.mock('../lib/billing', () => ({
  reportMeteredUsage: vi.fn(),
}));

import { handler } from './report-mutation-tax';
import { reportMeteredUsage } from '../lib/billing';

describe('report-mutation-tax handler', () => {
  const mockReportMeteredUsage = vi.mocked(reportMeteredUsage);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should report metered usage to Stripe when a valid mutation event is received', async () => {
    const event = {
      detail: {
        userId: 'user_123',
        mutationId: 'mut_456',
        repoName: 'test-repo',
        type: 'infra',
        status: 'SUCCESS',
      },
    };

    // First call: createMutationRecord (Update)
    mockSend.mockResolvedValueOnce({});
    // Second call: Get user metadata
    mockSend.mockResolvedValueOnce({
      Item: {
        stripeMutationSubscriptionItemId: 'si_789',
      },
    } as any);

    await handler(event);

    expect(mockSend).toHaveBeenCalledTimes(2);

    // Verify UpdateCommand (from createMutationRecord)
    const updateCall = mockSend.mock.calls[0][0] as any;
    expect(updateCall.input.Key).toEqual({
      PK: 'USER#user_123',
      SK: 'MUTATION#mut_456',
    });

    // Verify GetCommand
    const getCall = mockSend.mock.calls[1][0] as any;
    expect(getCall.input.Key).toEqual({ PK: 'USER#user_123', SK: 'METADATA' });

    expect(mockReportMeteredUsage).toHaveBeenCalledWith('si_789', 1);
  });

  it('should log a warning and return if subscription item ID is not found', async () => {
    const event = {
      detail: {
        userId: 'user_123',
        mutationId: 'mut_456',
      },
    };

    // 1. Update mutation record
    mockSend.mockResolvedValueOnce({});
    // 2. Get user metadata (missing SI)
    mockSend.mockResolvedValueOnce({ Item: null } as any);

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await handler(event);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'No Stripe subscription item found for user user_123'
      )
    );
    expect(mockReportMeteredUsage).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should waive the mutation tax and not report usage if user has opted into co-evolution', async () => {
    const event = {
      detail: {
        userId: 'user_123',
        mutationId: 'mut_456',
      },
    };

    // 1. Update mutation record
    mockSend.mockResolvedValueOnce({});
    // 2. Get user metadata (opted in)
    mockSend.mockResolvedValueOnce({
      Item: {
        stripeMutationSubscriptionItemId: 'si_789',
        coEvolutionOptIn: true,
      },
    } as any);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await handler(event);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'User user_123 opted into co-evolution. Tax waived.'
      )
    );
    expect(mockReportMeteredUsage).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
