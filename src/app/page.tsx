
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, BrainCircuit, LogIn, Target, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="dark bg-background text-foreground min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
            <BarChart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">ScoreSage</h1>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/login"><LogIn className="mr-2" /> Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup"><UserPlus className="mr-2" /> Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            Unlock Your Betting Edge
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            ScoreSage provides AI-powered sports betting analytics to help you find value bets and make smarter decisions. Stop guessing, start analyzing.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="text-lg">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-card p-6 rounded-lg border border-border">
                <BrainCircuit className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold">AI Predictions</h3>
                <p className="text-muted-foreground mt-2">Leverage our advanced AI to get data-driven match outcome predictions and confidence levels.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold">Value Bet Analysis</h3>
                <p className="text-muted-foreground mt-2">Automatically identify bets where the odds are in your favor based on our statistical models.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
                <BarChart className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold">Performance Tracking</h3>
                <p className="text-muted-foreground mt-2">Monitor the historical performance and accuracy of our models to bet with confidence.</p>
            </div>
        </div>
      </main>
      <footer className="p-4 text-center text-muted-foreground text-sm border-t border-border">
        <p>&copy; {new Date().getFullYear()} ScoreSage. All Rights Reserved.</p>
        <p className="mt-1">Please bet responsibly. Must be of legal age to gamble.</p>
      </footer>
    </div>
  );
}
