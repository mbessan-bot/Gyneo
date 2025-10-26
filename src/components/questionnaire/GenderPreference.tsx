import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GenderPreferenceProps {
  value: string;
  onChange: (value: string) => void;
}

export const GenderPreference = ({ value, onChange }: GenderPreferenceProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Gender Preference
        </h2>
        <p className="text-muted-foreground text-lg">
          Do you have a preference for your gynecologist's gender?
        </p>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="female" id="female" />
          <Label htmlFor="female" className="flex-1 cursor-pointer text-base font-medium">
            Female gynecologist
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="male" id="male" />
          <Label htmlFor="male" className="flex-1 cursor-pointer text-base font-medium">
            Male gynecologist
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
          <RadioGroupItem value="no-preference" id="no-preference" />
          <Label htmlFor="no-preference" className="flex-1 cursor-pointer text-base font-medium">
            No preference
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
