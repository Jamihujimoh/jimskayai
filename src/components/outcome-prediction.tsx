'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictMatchOutcome, type PredictMatchOutcomeOutput } from '@/ai/flows/outcome-prediction';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PredictionResult } from '@/components/prediction-result';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Target } from 'lucide-react';

const formSchema = z.object({
  team1: z.string().min(1, 'Team 1 name is required.'),
  team2: z.string().min(1, 'Team 2 name is required.'),
});

export function OutcomePrediction() {
  const [result, setResult] = React.useState<PredictMatchOutcomeOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team1: '',
      team2: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const prediction = await predictMatchOutcome(values);
      setResult(prediction);
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        variant: 'destructive',
        title: 'Prediction Error',
        description: 'Failed to generate a prediction. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="text-primary"/> Outcome Prediction</CardTitle>
          <CardDescription>Enter match details to predict the outcome using our AI model.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="team1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team 1</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Manchester United" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team 2</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Liverpool" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Predict Outcome
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="w-full">
        {isLoading && (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {result && (
          <div className="mt-6 lg:mt-0">
            <PredictionResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}