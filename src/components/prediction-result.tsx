import type { PredictMatchOutcomeOutput } from '@/ai/flows/outcome-prediction';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Target, Trophy } from 'lucide-react';

interface PredictionResultProps {
  result: PredictMatchOutcomeOutput;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const confidencePercentage = Math.round(result.confidenceLevel * 100);

  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary"/>
            Prediction Result
        </CardTitle>
        <CardDescription>
          Based on the data provided, here is the AI-generated prediction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Predicted Outcome</p>
          <p className="text-3xl font-bold text-primary">{result.predictedOutcome}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Confidence Level</p>
          <div className="flex items-center gap-3">
            <Progress value={confidencePercentage} className="w-full h-3" />
            <span className="font-bold text-xl text-primary">{confidencePercentage}%</span>
          </div>
        </div>

        <Separator />

        <div>
            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><Lightbulb className="text-yellow-400" />AI Analysis & Bet Suggestion</h4>
            <p className="text-muted-foreground bg-background/50 p-4 rounded-md border">{result.reasoning}</p>
        </div>
        
      </CardContent>
    </Card>
  );
}
