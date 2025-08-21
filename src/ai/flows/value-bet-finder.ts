'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying value bets by analyzing odds from various bookmakers and comparing them to the predicted probabilities.
 *
 * - valueBetFinder - A function that handles the value bet finding process.
 * - ValueBetFinderInput - The input type for the valueBetFinder function.
 * - ValueBetFinderOutput - The return type for the valueBetFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValueBetFinderInputSchema = z.object({
  predictedProbability: z
    .number()
    .describe('The predicted probability of a particular outcome (0 to 1).'),
  bookmakerOdds: z
    .number()
    .describe('The odds offered by a bookmaker for the same outcome.'),
  minimumValueThreshold: z
    .number()
    .describe(
      'The minimum threshold for the value of a bet to be considered a value bet (e.g., 1.05 for a 5% edge).'
    ),
});
export type ValueBetFinderInput = z.infer<typeof ValueBetFinderInputSchema>;

const ValueBetFinderOutputSchema = z.object({
  isValueBet: z.boolean().describe('Whether the bet is considered a value bet.'),
  valuePercentage: z
    .number()
    .describe('The calculated value percentage of the bet.'),
  reason: z
    .string()
    .describe('Explanation of why a bet is or is not a value bet.'),
});
export type ValueBetFinderOutput = z.infer<typeof ValueBetFinderOutputSchema>;

export async function valueBetFinder(input: ValueBetFinderInput): Promise<ValueBetFinderOutput> {
  return valueBetFinderFlow(input);
}

const valueBetFinderFlow = ai.defineFlow(
  {
    name: 'valueBetFinderFlow',
    inputSchema: ValueBetFinderInputSchema,
    outputSchema: ValueBetFinderOutputSchema,
  },
  async (input: ValueBetFinderInput): Promise<ValueBetFinderOutput> => {
    const impliedProbability = 1 / input.bookmakerOdds;
    const value = input.predictedProbability * input.bookmakerOdds - 1;
    const valuePercentage = value * 100;

    const isValueBet = input.predictedProbability > impliedProbability && (1 + value) > input.minimumValueThreshold;

    let reason = '';
    const formattedPredictedProb = (input.predictedProbability * 100).toFixed(1);
    const formattedImpliedProb = (impliedProbability * 100).toFixed(1);
    const formattedValue = valuePercentage.toFixed(1);
    const formattedThreshold = ((input.minimumValueThreshold -1) * 100).toFixed(1);

    if (isValueBet) {
      reason = `This is a value bet. Your predicted probability of ${formattedPredictedProb}% is higher than the implied probability of ${formattedImpliedProb}%, and the calculated value of +${formattedValue}% exceeds your minimum threshold of +${formattedThreshold}%.`;
    } else {
        if (input.predictedProbability <= impliedProbability) {
            reason = `This is not a value bet. Your predicted probability of ${formattedPredictedProb}% is not higher than the bookmaker's implied probability of ${formattedImpliedProb}%.`;
        } else {
            reason = `This is not a value bet. Although your probability is higher, the calculated value of +${formattedValue}% does not exceed your minimum threshold of +${formattedThreshold}%.`;
        }
    }

    return {
      isValueBet: isValueBet,
      valuePercentage: valuePercentage,
      reason: reason,
    };
  }
);
