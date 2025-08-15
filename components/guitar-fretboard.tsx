"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Music theory data
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const ROOT_NOTES = ["A", "B", "C", "D", "E", "F", "G"]

const CHORD_TYPES = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  "Dominant 7": [0, 4, 7, 10],
  "Minor 7": [0, 3, 7, 10],
  "Major 7": [0, 4, 7, 11],
  Diminished: [0, 3, 6],
  Augmented: [0, 4, 8],
  Sus2: [0, 2, 7],
  Sus4: [0, 5, 7],
}

const SCALES = {
  "Major (Ionian)": {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    modes: ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"],
  },
  "Natural Minor (Aeolian)": {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    modes: ["Aeolian", "Locrian", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian"],
  },
  "Pentatonic Major": {
    intervals: [0, 2, 4, 7, 9],
    modes: ["Major Pentatonic", "Egyptian", "Blues Minor", "Blues Major", "Minor Pentatonic"],
  },
  "Pentatonic Minor": {
    intervals: [0, 3, 5, 7, 10],
    modes: ["Minor Pentatonic", "Major Pentatonic", "Egyptian", "Blues Minor", "Blues Major"],
  },
  Blues: {
    intervals: [0, 3, 5, 6, 7, 10],
    modes: ["Blues", "Blues #2", "Blues #3", "Blues #4", "Blues #5", "Blues #6"],
  },
  Dorian: {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    modes: ["Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian", "Ionian"],
  },
  Mixolydian: {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    modes: ["Mixolydian", "Aeolian", "Locrian", "Ionian", "Dorian", "Phrygian", "Lydian"],
  },
}

const GUITAR_TUNING = ["E", "B", "G", "D", "A", "E"]
const FRETS = 12

interface FretboardNote {
  note: string
  fret: number
  string: number
  isChord?: boolean
  isScale?: boolean
  isRoot?: boolean
  scalePosition?: number
  mode?: string
}

export function GuitarFretboard() {
  const [selectedNote, setSelectedNote] = useState<string>("A")
  const [selectedChord, setSelectedChord] = useState<string | null>(null)
  const [selectedScale, setSelectedScale] = useState<string | null>(null)
  const [hoveredNote, setHoveredNote] = useState<FretboardNote | null>(null)
  const [showRootNotes, setShowRootNotes] = useState<boolean>(true)
  const [showChordNotes, setShowChordNotes] = useState<boolean>(true)
  const [showScaleNotes, setShowScaleNotes] = useState<boolean>(true)

  // Get note at specific fret and string
  const getNoteAtFret = (stringIndex: number, fret: number): string => {
    const openNote = GUITAR_TUNING[stringIndex]
    const openNoteIndex = NOTES.indexOf(openNote)
    return NOTES[(openNoteIndex + fret) % 12]
  }

  // Get chord notes
  const getChordNotes = (root: string, chordType: string): string[] => {
    if (!root || !chordType) return []
    const rootIndex = NOTES.indexOf(root)
    const intervals = CHORD_TYPES[chordType as keyof typeof CHORD_TYPES]
    return intervals.map((interval) => NOTES[(rootIndex + interval) % 12])
  }

  // Get scale notes
  const getScaleNotes = (root: string, scaleName: string): string[] => {
    if (!root || !scaleName) return []
    const rootIndex = NOTES.indexOf(root)
    const scale = SCALES[scaleName as keyof typeof SCALES]
    return scale.intervals.map((interval) => NOTES[(rootIndex + interval) % 12])
  }

  // Generate fretboard data
  const generateFretboard = (): FretboardNote[][] => {
    const chordNotes = selectedNote && selectedChord ? getChordNotes(selectedNote, selectedChord) : []
    const scaleNotes = selectedNote && selectedScale ? getScaleNotes(selectedNote, selectedScale) : []

    return GUITAR_TUNING.map((_, stringIndex) => {
      return Array.from({ length: FRETS + 1 }, (_, fret) => {
        const note = getNoteAtFret(stringIndex, fret)
        const isChordNote = chordNotes.includes(note)
        const isScaleNote = scaleNotes.includes(note)
        const isRoot = note === selectedNote

        let scalePosition = -1
        let mode = ""

        if (isScaleNote && selectedScale) {
          const scale = SCALES[selectedScale as keyof typeof SCALES]
          const rootIndex = NOTES.indexOf(selectedNote)
          const noteIndex = NOTES.indexOf(note)
          const interval = (noteIndex - rootIndex + 12) % 12
          scalePosition = scale.intervals.indexOf(interval)
          if (scalePosition !== -1) {
            mode = scale.modes[scalePosition]
          }
        }

        return {
          note,
          fret,
          string: stringIndex,
          isChord: isChordNote,
          isScale: isScaleNote,
          isRoot,
          scalePosition: scalePosition !== -1 ? scalePosition + 1 : undefined,
          mode,
        }
      })
    })
  }

  const fretboard = generateFretboard()

  const currentChordNotes = selectedNote && selectedChord ? getChordNotes(selectedNote, selectedChord) : []
  const currentScaleNotes = selectedNote && selectedScale ? getScaleNotes(selectedNote, selectedScale) : []

  const handleNoteHover = (fretNote: FretboardNote) => {
    setHoveredNote(fretNote)
  }

  const handleNoteLeave = () => {
    setHoveredNote(null)
  }

  const getFretMarkers = (fret: number): boolean => {
    return [3, 5, 7, 9, 12].includes(fret)
  }

  const getDoubleFretMarkers = (fret: number): boolean => {
    return fret === 12
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Root Note</label>
              <Select value={selectedNote} onValueChange={setSelectedNote}>
                <SelectTrigger>
                  <SelectValue placeholder="Select note" />
                </SelectTrigger>
                <SelectContent>
                  {ROOT_NOTES.map((note) => (
                    <SelectItem key={note} value={note}>
                      {note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chord</label>
              <Select
                value={selectedChord || ""}
                onValueChange={(value) => {
                  setSelectedChord(value === "none" ? null : value)
                }}
                disabled={!selectedNote}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chord" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {Object.keys(CHORD_TYPES).map((chord) => (
                    <SelectItem key={chord} value={chord}>
                      {chord}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scale</label>
              <Select
                value={selectedScale || ""}
                onValueChange={(value) => setSelectedScale(value === "none" ? null : value)}
                disabled={!selectedNote}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {Object.keys(SCALES).map((scale) => (
                    <SelectItem key={scale} value={scale}>
                      {scale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRootNotes(!showRootNotes)}
                className={`w-5 h-5 rounded-full border-2 border-red-500 transition-colors ${
                  showRootNotes ? "bg-red-500" : "bg-transparent"
                }`}
                aria-label="Toggle root notes"
              />
              <label className="text-sm cursor-pointer" onClick={() => setShowRootNotes(!showRootNotes)}>
                Root Notes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowChordNotes(!showChordNotes)}
                className={`w-5 h-5 rounded-full border-2 border-blue-500 transition-colors ${
                  showChordNotes ? "bg-blue-500" : "bg-transparent"
                }`}
                aria-label="Toggle chord notes"
              />
              <label className="text-sm cursor-pointer" onClick={() => setShowChordNotes(!showChordNotes)}>
                Chord Notes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowScaleNotes(!showScaleNotes)}
                className={`w-5 h-5 rounded-full border-2 border-green-500 transition-colors ${
                  showScaleNotes ? "bg-green-500" : "bg-transparent"
                }`}
                aria-label="Toggle scale notes"
              />
              <label className="text-sm cursor-pointer" onClick={() => setShowScaleNotes(!showScaleNotes)}>
                Scale Notes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-purple-500"></div>
              <span className="text-sm">Chord + Scale</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {(currentChordNotes.length > 0 || currentScaleNotes.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Current Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentChordNotes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    Chord ({selectedNote} {selectedChord}):
                  </span>
                  {currentChordNotes.map((note, index) => (
                    <Badge key={index} className="bg-blue-500 text-white">
                      {note}
                    </Badge>
                  ))}
                </div>
              )}

              {currentScaleNotes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    Scale ({selectedNote} {selectedScale}):
                  </span>
                  {currentScaleNotes.map((note, index) => (
                    <Badge key={index} className="bg-green-500 text-white">
                      {note}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fretboard */}
      <Card>
        <CardHeader>
          <CardTitle>Fretboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] space-y-1">
              {/* Fret numbers */}
              <div className="flex">
                <div className="w-12"></div>
                {Array.from({ length: FRETS + 1 }, (_, fret) => (
                  <div key={fret} className="w-16 text-center text-xs text-muted-foreground">
                    {fret}
                  </div>
                ))}
              </div>

              {/* Strings */}
              {fretboard.map((string, stringIndex) => (
                <div key={stringIndex} className="flex items-center">
                  {/* String name */}
                  <div className="w-12 text-right pr-2 text-sm font-medium">{GUITAR_TUNING[stringIndex]}</div>

                  {/* Frets */}
                  <div className="flex">
                    {string.map((fretNote, fretIndex) => {
                      const shouldShowRoot = fretNote.isRoot && showRootNotes
                      const shouldShowChord = fretNote.isChord && showChordNotes && !fretNote.isRoot
                      const shouldShowScale =
                        fretNote.isScale && showScaleNotes && !fretNote.isRoot && !fretNote.isChord
                      const shouldShowChordScale =
                        fretNote.isChord && fretNote.isScale && showChordNotes && showScaleNotes && !fretNote.isRoot

                      const shouldShowNote =
                        shouldShowRoot || shouldShowChord || shouldShowScale || shouldShowChordScale

                      return (
                        <div
                          key={fretIndex}
                          className="relative w-16 h-8 border-r border-border flex items-center justify-center cursor-pointer hover:bg-muted/50"
                          onMouseEnter={() => handleNoteHover(fretNote)}
                          onMouseLeave={handleNoteLeave}
                        >
                          {/* String line */}
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-0.5 bg-muted-foreground/30"></div>
                          </div>

                          {/* Fret markers */}
                          {stringIndex === 3 && getFretMarkers(fretIndex) && (
                            <div className="absolute -bottom-6">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                              {getDoubleFretMarkers(fretIndex) && (
                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 mt-1"></div>
                              )}
                            </div>
                          )}

                          {/* Note dot */}
                          {shouldShowNote && (
                            <div
                              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                shouldShowRoot
                                  ? "bg-red-500"
                                  : shouldShowChordScale
                                    ? "bg-purple-500"
                                    : shouldShowChord
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                              } transition-all duration-200`}
                            >
                              {fretNote.note}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover info */}
      {hoveredNote && (hoveredNote.isScale || hoveredNote.isChord) && (
        <Card>
          <CardHeader>
            <CardTitle>Note Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Note: {hoveredNote.note}</Badge>
                <Badge variant="outline">Fret: {hoveredNote.fret}</Badge>
                <Badge variant="outline">String: {GUITAR_TUNING[hoveredNote.string]}</Badge>
              </div>

              {hoveredNote.isScale && hoveredNote.scalePosition && (
                <div className="space-y-1">
                  <p className="text-sm">
                    <strong>Scale Position:</strong> {hoveredNote.scalePosition}
                  </p>
                  {hoveredNote.mode && (
                    <p className="text-sm">
                      <strong>Mode:</strong> {hoveredNote.mode}
                    </p>
                  )}
                </div>
              )}

              {hoveredNote.isChord && selectedChord && (
                <p className="text-sm">
                  <strong>Chord Note:</strong> Part of {hoveredNote.note} {selectedChord}
                </p>
              )}

              {hoveredNote.isRoot && <Badge className="bg-red-500">Root Note</Badge>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
