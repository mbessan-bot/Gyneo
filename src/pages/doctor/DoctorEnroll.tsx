import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DoctorEnroll = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    gender: "",
    practiceTypes: [] as string[],
    consultationReasons: [] as string[],
    specialConditions: [] as string[],
    languages: [] as string[],
    availability: [] as string[],
    yearsExperience: "",
    bio: "",
    rating: 5,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login first");
      navigate("/doctor/login");
      return;
    }
    setUserId(user.id);
  };

  const practiceTypeOptions = ["solo-practice", "group-practice", "hospital"];
  const consultationOptions = ["routine-checkup", "pregnancy-care", "fertility", "menopause", "pcos-endometriosis", "contraception"];
  const specialConditionOptions = ["high-risk-pregnancy", "chronic-conditions", "mental-health", "lgbtq-care"];
  const languageOptions = ["english", "spanish", "french", "mandarin", "arabic"];
  const availabilityOptions = ["weekday-mornings", "weekday-afternoons", "weekday-evenings", "weekend-mornings", "weekend-afternoons"];
  const genderOptions = ["female", "male"];

  const handleCheckbox = (field: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Authentication error");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("gynecologists").insert({
        doctor_id: userId,
        name: formData.name,
        specialty: formData.specialty,
        gender: formData.gender,
        practice_types: formData.practiceTypes,
        consultation_reasons: formData.consultationReasons,
        special_conditions: formData.specialConditions,
        languages: formData.languages,
        availability: formData.availability,
        years_experience: parseInt(formData.yearsExperience),
        bio: formData.bio,
        rating: formData.rating,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Profile created successfully!");
      navigate("/doctor/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">Help patients find you by completing your profile</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  placeholder="e.g., Obstetrics & Gynecology"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience *</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <div className="flex gap-4">
                  {genderOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender-${option}`}
                        checked={formData.gender === option}
                        onCheckedChange={() => setFormData(prev => ({ ...prev, gender: option }))}
                      />
                      <Label htmlFor={`gender-${option}`} className="capitalize">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Practice Types *</Label>
              <div className="grid md:grid-cols-3 gap-3">
                {practiceTypeOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`practice-${option}`}
                      checked={formData.practiceTypes.includes(option)}
                      onCheckedChange={() => handleCheckbox('practiceTypes', option)}
                    />
                    <Label htmlFor={`practice-${option}`} className="capitalize">{option.replace('-', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Consultation Specialties *</Label>
              <div className="grid md:grid-cols-3 gap-3">
                {consultationOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`consultation-${option}`}
                      checked={formData.consultationReasons.includes(option)}
                      onCheckedChange={() => handleCheckbox('consultationReasons', option)}
                    />
                    <Label htmlFor={`consultation-${option}`} className="capitalize">{option.replace('-', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Special Conditions</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {specialConditionOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${option}`}
                      checked={formData.specialConditions.includes(option)}
                      onCheckedChange={() => handleCheckbox('specialConditions', option)}
                    />
                    <Label htmlFor={`condition-${option}`} className="capitalize">{option.replace('-', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages *</Label>
              <div className="grid md:grid-cols-3 gap-3">
                {languageOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${option}`}
                      checked={formData.languages.includes(option)}
                      onCheckedChange={() => handleCheckbox('languages', option)}
                    />
                    <Label htmlFor={`language-${option}`} className="capitalize">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Availability *</Label>
              <div className="grid md:grid-cols-3 gap-3">
                {availabilityOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option}`}
                      checked={formData.availability.includes(option)}
                      onCheckedChange={() => handleCheckbox('availability', option)}
                    />
                    <Label htmlFor={`availability-${option}`} className="capitalize">{option.replace('-', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell patients about yourself and your practice..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Creating Profile..." : "Complete Enrollment"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DoctorEnroll;
