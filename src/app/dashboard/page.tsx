
'use client';

import { BrainCircuit, Calculator, Flame, GanttChartSquare, Target, Trophy } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { OutcomePrediction } from '@/components/outcome-prediction';
import { PerformanceMetrics } from '@/components/performance-metrics';
import { ValueBetFinder } from '@/components/value-bet-finder';
import { HighConfidenceBets } from '@/components/high-confidence-bets';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              <Link href="/">ScoreSage</Link>
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#prediction" isActive>
                <Target />
                Outcome Prediction
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#value-finder">
                <Calculator />
                Value Bet Finder
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#performance">
                <GanttChartSquare />
                Performance
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#hot-bets">
                <Flame />
                Hot Bets
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground p-2">
            Disclaimer: Sports betting involves risk. Predictions are not guaranteed. Please bet responsibly.
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Welcome, {user?.email}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
             Sign Out
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 space-y-12">
          <section id="prediction">
            <OutcomePrediction />
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section id="value-finder">
              <ValueBetFinder />
            </section>
            <section id="performance">
              <PerformanceMetrics />
            </section>
          </div>
          <section id="hot-bets">
            <HighConfidenceBets />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
