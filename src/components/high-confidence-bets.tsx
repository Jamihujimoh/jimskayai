import { Flame, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const bets = [
  {
    match: 'Manchester City vs. Arsenal',
    market: 'Match Winner',
    pick: 'Manchester City',
    confidence: 'High',
    league: 'Premier League',
  },
  {
    match: 'Real Madrid vs. Barcelona',
    market: 'Both Teams to Score',
    pick: 'Yes',
    confidence: 'High',
    league: 'La Liga',
  },
  {
    match: 'Novak Djokovic vs. Carlos Alcaraz',
    market: 'Total Sets',
    pick: 'Over 3.5',
    confidence: 'Medium',
    league: 'Grand Slam Final',
  },
  {
    match: 'Bayern Munich vs. Borussia Dortmund',
    market: 'Over/Under 2.5 Goals',
    pick: 'Over 2.5',
    confidence: 'High',
    league: 'Bundesliga',
  }
];

export function HighConfidenceBets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-red-500" />
          Hot Bets
        </CardTitle>
        <CardDescription>
          High-confidence predictions based on our latest data analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match / Event</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Pick</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{bet.match}</div>
                  <div className="text-sm text-muted-foreground">{bet.league}</div>
                </TableCell>
                <TableCell>{bet.market}</TableCell>
                <TableCell className="font-semibold text-primary">{bet.pick}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={bet.confidence === 'High' ? 'default' : 'secondary'} className="bg-green-600/20 text-green-400 border-green-600/30">
                    {bet.confidence}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
