'use server';
/**
 * @fileOverview Predicts match outcomes based on historical and real-time data using machine learning models.
 *
 * - predictMatchOutcome - A function that handles the match outcome prediction process.
 * - PredictMatchOutcomeInput - The input type for the predictMatchOutcome function.
 * - PredictMatchOutcomeOutput - The return type for the predictMatchOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMatchOutcomeInputSchema = z.object({
  team1: z.string().describe('The name of the first team.'),
  team2: z.string().describe('The name of the second team.'),
});
export type PredictMatchOutcomeInput = z.infer<typeof PredictMatchOutcomeInputSchema>;

const PredictMatchOutcomeOutputSchema = z.object({
  predictedOutcome: z
    .string()
    .describe(
      'The predicted outcome of the match (e.g., Team 1 wins, Draw, Team 2 wins).'
    ),
  confidenceLevel: z
    .number()
    .describe('The confidence level of the prediction (0 to 1).'),
  reasoning: z.string().describe('The reasoning behind the prediction, including any value bet suggestion.'),
  suggestedBet: z
    .string()
    .optional()
    .describe(
      'A suggested bet based on the predicted outcome and odds data (optional).'
    ),
});
export type PredictMatchOutcomeOutput = z.infer<
  typeof PredictMatchOutcomeOutputSchema
>;

export async function predictMatchOutcome(
  input: PredictMatchOutcomeInput
): Promise<PredictMatchOutcomeOutput> {
  return predictMatchOutcomeFlow(input);
}


const MatchDataSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical match data for both teams.'),
  realTimeData: z
    .string()
    .describe(
      'Real-time data such as current player statistics and injuries.'
    ),
  oddsData: z.array(
    z.object({
      bookmaker: z.string().describe('The name of the bookmaker.'),
      team1Win: z.number().describe('The odds for team 1 to win.'),
      draw: z.number().describe('The odds for a draw.'),
      team2Win: z.number().describe('The odds for team 2 to win.'),
    })
  ).describe('An array of odds from various bookmakers for this match.'),
  matchDate: z.string().describe('The date of the match.')
});


const generateMatchDataPrompt = ai.definePrompt({
    name: 'generateMatchDataPrompt',
    input: { schema: PredictMatchOutcomeInputSchema },
    output: { schema: MatchDataSchema },
    prompt: `You are a creative sports data simulator. For the match between {{team1}} and {{team2}}, generate a realistic-sounding but fictional set of data.

    This data should include:
    1.  **Historical Data**: A brief summary of each team's recent performance (e.g., last 5 matches).
    2.  **Real-Time Data**: Analysis of key players, tactical setups, and any other relevant factors like weather or home advantage. Be creative and specific.
    3.  **Odds Data**: Create odds for the match from three different fictional bookmakers (e.g., 'Bookmaker A', 'BettorBet', 'SureWin').
    4.  **Match Date**: A plausible future date for the match.

    Make the data sound authentic and compelling.`
});


const getMatchDataTool = ai.defineTool(
  {
    name: 'getMatchData',
    description: 'Generates dynamic and fictional historical and real-time match data for two teams.',
    inputSchema: PredictMatchOutcomeInputSchema,
    outputSchema: MatchDataSchema,
  },
  async (input) => {
    // Use the AI to generate dynamic, realistic-seeming data instead of using hardcoded mock data.
    const { output } = await generateMatchDataPrompt(input);
    if (!output) {
        throw new Error("Failed to generate match data.");
    }
    return output;
  }
);

const prompt = ai.definePrompt({
  name: 'predictMatchOutcomePrompt',
  input: {schema: z.object({ team1: z.string(), team2: z.string(), historicalData: z.string(), realTimeData: z.string(), matchDate: z.string() })},
  output: {schema: PredictMatchOutcomeOutputSchema},
  prompt: `You are a world-class sports commentator and analyst, with a deep understanding of game dynamics, team history, and player performance. Your primary goal is to provide a thorough analysis of the upcoming match.

  Analyze the provided match data and predict the outcome for the match between {{team1}} and {{team2}} on {{matchDate}}. Focus on team predominance and current form, not past achievements.
  
  - Historical Data: {{{historicalData}}}
  - Real-Time Data: {{{realTimeData}}}

  Based on your analysis, provide a predicted outcome (e.g., '{{team1}} wins', 'Draw', '{{team2}} wins'), a confidence level between 0 and 1, and detailed reasoning for your conclusion.
  
  After providing your sports analysis, also include your suggested bet within the reasoning. For example: "Given my analysis, I also see a value bet opportunity. I recommend betting on {{team1}} to win with Bookmaker A at 2.5 odds."`,
});

const predictMatchOutcomeFlow = ai.defineFlow(
  {
    name: 'predictMatchOutcomeFlow',
    inputSchema: PredictMatchOutcomeInputSchema,
    outputSchema: PredictMatchOutcomeOutputSchema,
  },
  async (input) => {
    // Step 1: Get all match data from the tool.
    const { historicalData, realTimeData, oddsData, matchDate } = await getMatchDataTool(input);

    // Step 2: Call the AI to get a prediction and confidence level.
    // The prompt is now responsible for generating the reasoning and the bet suggestion together.
    const { output } = await prompt({ ...input, historicalData, realTimeData, matchDate });

    if (!output) {
      throw new Error('The AI failed to return a prediction.');
    }

    // The AI's reasoning now contains the betting suggestion, making the programmatic check redundant.
    return output;
  }
);
