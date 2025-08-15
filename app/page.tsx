import { GuitarFretboard } from "@/components/guitar-fretboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Guitar Fretboard Explorer</h1>
        <GuitarFretboard />
      </div>
    </main>
  )
}
