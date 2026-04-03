import { auth } from '../../../../auth';
import { NextResponse } from 'next/server';
import { docClient } from '../../../../lib/db';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(req: Request) {
  const session = (await auth()) as any;

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const {
      coEvolutionOptIn,
      autoTopupEnabled,
      aiRefillThresholdCents,
      telegramBotToken,
      slackWebhookUrl,
    } = await req.json();

    const updateExpression = [];
    const expressionAttributeValues: any = {};

    if (coEvolutionOptIn !== undefined) {
      updateExpression.push('coEvolutionOptIn = :coevo');
      expressionAttributeValues[':coevo'] = coEvolutionOptIn;
    }

    if (autoTopupEnabled !== undefined) {
      updateExpression.push('autoTopupEnabled = :topup');
      expressionAttributeValues[':topup'] = autoTopupEnabled;
    }

    if (aiRefillThresholdCents !== undefined) {
      updateExpression.push('aiRefillThresholdCents = :threshold');
      expressionAttributeValues[':threshold'] = aiRefillThresholdCents;
    }

    if (telegramBotToken !== undefined) {
      updateExpression.push('telegramBotToken = :tg');
      expressionAttributeValues[':tg'] = telegramBotToken;
    }

    if (slackWebhookUrl !== undefined) {
      updateExpression.push('slackWebhookUrl = :slack');
      expressionAttributeValues[':slack'] = slackWebhookUrl;
    }

    if (updateExpression.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    await docClient.send(
      new UpdateCommand({
        TableName: process.env.DYNAMO_TABLE,
        Key: { PK: `USER#${userEmail}`, SK: 'METADATA' },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SettingsAPI] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
