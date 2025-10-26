import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PracticeTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export const PracticeType = ({ value, onChange }: PracticeTypeProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Practice Type
        </h2>
        <p className="text-muted-foreground text-lg">
          What type of practice setting do you prefer?
        </p>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="hospital" id="hospital" className="mt-1" />
          <Label htmlFor="hospital" className="flex-1 cursor-pointer">
            <div className="font-medium text-base">Hospital-based practice</div>
            <p className="text-sm text-muted-foreground mt-1">
              Full-service hospital environment with comprehensive care
            </p>
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="private" id="private" className="mt-1" />
          <Label htmlFor="private" className="flex-1 cursor-pointer">
            <div className="font-medium text-base">Private practice</div>
            <p className="text-sm text-muted-foreground mt-1">
              Personalized care in a private clinical setting
            </p>
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="clinic" id="clinic" className="mt-1" />
          <Label htmlFor="clinic" className="flex-1 cursor-pointer">
            <div className="font-medium text-base">Clinic or health center</div>
            <p className="text-sm text-muted-foreground mt-1">
              Community-focused care with flexible options
            </p>
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="no-preference" id="no-preference-practice" className="mt-1" />
          <Label htmlFor="no-preference-practice" className="flex-1 cursor-pointer">
            <div className="font-medium text-base">No preference</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
