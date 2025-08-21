'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { valueBetFinder, type ValueBetFinderOutput } from '@/ai/flows/value-bet-finder';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

const formSchema = z.object({
  predictedProbability: z.coerce.number().min(0, 'Must be at least 0').max(1, 'Must be at most 1'),
  bookmakerOdds: z.coerce.number().min(1, 'Odds must be at least 1'),
  minimumValueThreshold: z.coerce.number().min(1, 'Threshold must be at least 1'),
});

export function ValueBetFinder() {
  const [result, setResult] = React.useState<ValueBetFinderOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      predictedProbability: 0.5,
      bookmakerOdds: 2.1,
      minimumValueThreshold: 1.05,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const betAnalysis = await valueBetFinder(values);
      setResult(betAnalysis);
    } catch (error) {
      console.error('Value bet check failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: 'Failed to analyze the bet. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Value Bet Finder
        </CardTitle>
        <CardDescription>Manually analyze odds to find potential value bets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="predictedProbability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Predicted Probability (0-1)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 0.55" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookmakerOdds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bookmaker Odds</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 2.10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimumValueThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Value Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 1.05" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Bet
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 space-y-3">
            <Separator />
            <div className={`flex flex-col items-center text-center p-4 rounded-lg ${result.isValueBet ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                {result.isValueBet ? (
                    <ThumbsUp className="h-10 w-10 text-green-400 mb-2" />
                ) : (
                    <ThumbsDown className="h-10 w-10 text-red-400 mb-2" />
                )}
                <Badge variant={result.isValueBet ? 'default' : 'destructive'} className={`${result.isValueBet ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {result.isValueBet ? 'Value Bet Found' : 'Not a Value Bet'}
                </Badge>
                <p className="mt-2 text-sm text-muted-foreground">{result.reason}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}