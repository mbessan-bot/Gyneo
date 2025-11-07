import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, Languages, Stethoscope } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

interface Gynecologist {
  id: string;
  name: string;
  gender: string;
  practice_type: string;
  specialties: string[];
  languages: string[];
  availability: string[];
  location: string;
  rating: number;
  years_experience: number;
  bio: string;
  match_score: number;
}

interface MatchResultsProps {
  matches: Gynecologist[];
  onStartOver: () => void;
}

export const MatchResults = ({ matches, onStartOver }: MatchResultsProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string } | null>(null);

  const formatSpecialty = (specialty: string) => {
    return specialty
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatAvailability = (availability: string) => {
    return availability
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Top Matches
        </h2>
        <p className="text-muted-foreground text-lg">
          We found {matches.length} gynecologist{matches.length !== 1 ? 's' : ''} that match your preferences
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((gyno, index) => (
          <Card key={gyno.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{gyno.name}</CardTitle>
                    {index === 0 && (
                      <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary">
                        Best Match
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {gyno.location}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{gyno.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {gyno.years_experience} years exp.
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">{gyno.bio}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <span>Specialties</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gyno.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {formatSpecialty(specialty)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Languages className="w-4 h-4 text-primary" />
                    <span>Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gyno.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language.charAt(0).toUpperCase() + language.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Availability</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gyno.availability.map((slot) => (
                      <Badge key={slot} variant="outline">
                        {formatAvailability(slot)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Badge variant="secondary" className="bg-primary/10">
                  Practice Type: {formatSpecialty(gyno.practice_type)}
                </Badge>
              </div>

              <Button 
                className="w-full"
                onClick={() => setSelectedDoctor({ id: gyno.id, name: gyno.name })}
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onStartOver} className="min-w-[200px]">
          Start Over
        </Button>
      </div>

      <BookingDialog
        open={!!selectedDoctor}
        onOpenChange={(open) => !open && setSelectedDoctor(null)}
        gynecologistId={selectedDoctor?.id || ""}
        gynecologistName={selectedDoctor?.name || ""}
      />
    </div>
  );
};
