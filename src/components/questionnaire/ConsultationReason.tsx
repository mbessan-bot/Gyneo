import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ConsultationReasonProps {
  value: string;
  onChange: (value: string) => void;
}

export const ConsultationReason = ({ value, onChange }: ConsultationReasonProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Reason for Consultation
        </h2>
        <p className="text-muted-foreground text-lg">
          What brings you to seek gynecological care?
        </p>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="routine" id="routine" />
          <Label htmlFor="routine" className="flex-1 cursor-pointer text-base font-medium">
            Routine checkup / Annual exam
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="pregnancy" id="pregnancy" />
          <Label htmlFor="pregnancy" className="flex-1 cursor-pointer text-base font-medium">
            Pregnancy care / Prenatal visit
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="contraception" id="contraception" />
          <Label htmlFor="contraception" className="flex-1 cursor-pointer text-base font-medium">
            Contraception / Family planning
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="symptoms" id="symptoms" />
          <Label htmlFor="symptoms" className="flex-1 cursor-pointer text-base font-medium">
            Specific symptoms or concerns
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="fertility" id="fertility" />
          <Label htmlFor="fertility" className="flex-1 cursor-pointer text-base font-medium">
            Fertility consultation
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="menopause" id="menopause" />
          <Label htmlFor="menopause" className="flex-1 cursor-pointer text-base font-medium">
            Menopause management
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other" className="flex-1 cursor-pointer text-base font-medium">
            Other
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
