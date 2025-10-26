import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { GeneralInfo } from "@/components/questionnaire/GeneralInfo";
import { GenderPreference } from "@/components/questionnaire/GenderPreference";
import { PracticeType } from "@/components/questionnaire/PracticeType";
import { ConsultationReason } from "@/components/questionnaire/ConsultationReason";
import { SpecialConditions } from "@/components/questionnaire/SpecialConditions";
import { LanguagePreference } from "@/components/questionnaire/LanguagePreference";
import { Availability } from "@/components/questionnaire/Availability";
import { ComfortLevel } from "@/components/questionnaire/ComfortLevel";
import { ChevronLeft, ChevronRight, CheckCircle2, Heart } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  generalInfo: {
    name: string;
    age: string;
    email: string;
    phone: string;
  };
  genderPreference: string;
  practiceType: string;
  consultationReason: string;
  specialConditions: string[];
  languagePreference: string;
  availability: string[];
  sensitivity: string;
  notes: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    generalInfo: { name: "", age: "", email: "", phone: "" },
    genderPreference: "",
    practiceType: "",
    consultationReason: "",
    specialConditions: [],
    languagePreference: "",
    availability: [],
    sensitivity: "",
    notes: "",
  });

  const totalSteps = 8;

  const updateGeneralInfo = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value },
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.generalInfo.name &&
          formData.generalInfo.age &&
          formData.generalInfo.email &&
          formData.generalInfo.phone
        );
      case 1:
        return formData.genderPreference !== "";
      case 2:
        return formData.practiceType !== "";
      case 3:
        return formData.consultationReason !== "";
      case 4:
        return formData.specialConditions.length > 0;
      case 5:
        return formData.languagePreference !== "";
      case 6:
        return formData.availability.length > 0;
      case 7:
        return formData.sensitivity !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please complete all required fields");
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!canProceed()) {
      toast.error("Please complete all required fields");
      return;
    }
    console.log("Form submitted:", formData);
    toast.success("Thank you! We're finding the perfect match for you.");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <GeneralInfo data={formData.generalInfo} onChange={updateGeneralInfo} />;
      case 1:
        return (
          <GenderPreference
            value={formData.genderPreference}
            onChange={(value) => setFormData((prev) => ({ ...prev, genderPreference: value }))}
          />
        );
      case 2:
        return (
          <PracticeType
            value={formData.practiceType}
            onChange={(value) => setFormData((prev) => ({ ...prev, practiceType: value }))}
          />
        );
      case 3:
        return (
          <ConsultationReason
            value={formData.consultationReason}
            onChange={(value) => setFormData((prev) => ({ ...prev, consultationReason: value }))}
          />
        );
      case 4:
        return (
          <SpecialConditions
            values={formData.specialConditions}
            onChange={(values) => setFormData((prev) => ({ ...prev, specialConditions: values }))}
          />
        );
      case 5:
        return (
          <LanguagePreference
            value={formData.languagePreference}
            onChange={(value) => setFormData((prev) => ({ ...prev, languagePreference: value }))}
          />
        );
      case 6:
        return (
          <Availability
            values={formData.availability}
            onChange={(values) => setFormData((prev) => ({ ...prev, availability: values }))}
          />
        );
      case 7:
        return (
          <ComfortLevel
            sensitivity={formData.sensitivity}
            notes={formData.notes}
            onSensitivityChange={(value) => setFormData((prev) => ({ ...prev, sensitivity: value }))}
            onNotesChange={(value) => setFormData((prev) => ({ ...prev, notes: value }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Find Your Perfect Match
          </h1>
          <p className="text-muted-foreground text-lg">
            Connecting you with the right gynecologist for your needs
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 md:p-10 backdrop-blur-sm bg-card/95">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button size="lg" onClick={handleNext} className="gap-2">
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleSubmit} variant="secondary" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Find My Match
              </Button>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Your information is secure and confidential</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
