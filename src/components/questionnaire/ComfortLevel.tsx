import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface ComfortLevelProps {
  sensitivity: string;
  notes: string;
  onSensitivityChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const ComfortLevel = ({
  sensitivity,
  notes,
  onSensitivityChange,
  onNotesChange,
}: ComfortLevelProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Comfort & Sensitivity
        </h2>
        <p className="text-muted-foreground text-lg">
          Help us understand your comfort level and any special considerations
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">
            How would you rate your comfort level with medical examinations?
          </Label>
          <RadioGroup value={sensitivity} onValueChange={onSensitivityChange} className="space-y-3">
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="comfortable" id="comfortable" />
              <Label htmlFor="comfortable" className="flex-1 cursor-pointer text-base">
                Very comfortable
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="somewhat" id="somewhat" />
              <Label htmlFor="somewhat" className="flex-1 cursor-pointer text-base">
                Somewhat comfortable
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="anxious" id="anxious" />
              <Label htmlFor="anxious" className="flex-1 cursor-pointer text-base">
                Anxious / Need extra support
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="trauma" id="trauma" />
              <Label htmlFor="trauma" className="flex-1 cursor-pointer text-base">
                History of trauma / Very sensitive
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="notes" className="text-base font-medium mb-2 block">
            Additional notes or specific requirements (Optional)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Please share any additional information that would help us find the best match for you..."
            className="min-h-[120px] text-base resize-none"
          />
        </div>
      </div>
    </div>
  );
};
