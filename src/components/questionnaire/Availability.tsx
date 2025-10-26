import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AvailabilityProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export const Availability = ({ values, onChange }: AvailabilityProps) => {
  const timeSlots = [
    { id: "weekday-morning", label: "Weekday mornings (8 AM - 12 PM)" },
    { id: "weekday-afternoon", label: "Weekday afternoons (12 PM - 5 PM)" },
    { id: "weekday-evening", label: "Weekday evenings (5 PM - 8 PM)" },
    { id: "weekend-morning", label: "Weekend mornings" },
    { id: "weekend-afternoon", label: "Weekend afternoons" },
    { id: "flexible", label: "Flexible / Any time" },
  ];

  const handleToggle = (timeId: string) => {
    const newValues = values.includes(timeId)
      ? values.filter((v) => v !== timeId)
      : [...values, timeId];
    onChange(newValues);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Availability
        </h2>
        <p className="text-muted-foreground text-lg">
          When are you typically available for appointments? (Select all that apply)
        </p>
      </div>

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <Checkbox
              id={slot.id}
              checked={values.includes(slot.id)}
              onCheckedChange={() => handleToggle(slot.id)}
            />
            <Label htmlFor={slot.id} className="flex-1 cursor-pointer text-base font-medium">
              {slot.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
