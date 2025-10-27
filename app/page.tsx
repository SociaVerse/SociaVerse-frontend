import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    // This div will grow to fill the available space
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      
      <section className="container max-w-4xl py-20 md:py-32">
        
        {/* Animated Headline */}
        <h1 
          className="text-5xl md:text-7xl font-bold animate-in fade-in slide-in-from-bottom-12 duration-1000"
        >
          Welcome to the <span className="text-primary">SociaVerse</span>
        </h1>

        {/* Sub-headline */}
        <p 
          className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200"
        >
          Connect, create, and explore in a decentralized universe.
          Your new digital identity awaits.
        </p>

        {/* Call-to-Action Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400"
        >
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/signup">Join the Beta</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/explore">Learn More</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-6">
            <Link href="/login">Login</Link>
          </Button>
        </div>
        
      </section>
      
    </div>
  );
}