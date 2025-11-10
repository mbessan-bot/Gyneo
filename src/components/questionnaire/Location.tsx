import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LocationProps {
  value: string;
  onChange: (value: string) => void;
}

const locationOptions = [
  { value: "lyon-1er", label: "Lyon 1er - Presqu'île" },
  { value: "lyon-2e", label: "Lyon 2e - Confluence" },
  { value: "lyon-3e", label: "Lyon 3e - Part-Dieu" },
  { value: "lyon-4e", label: "Lyon 4e - Croix-Rousse" },
  { value: "lyon-5e", label: "Lyon 5e - Vieux Lyon" },
  { value: "lyon-6e", label: "Lyon 6e - Brotteaux" },
  { value: "lyon-7e", label: "Lyon 7e - Gerland" },
  { value: "lyon-8e", label: "Lyon 8e - Monplaisir" },
  { value: "lyon-9e", label: "Lyon 9e - Vaise" },
];

export const Location = ({ value, onChange }: LocationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Location Preference</h3>
        <p className="text-muted-foreground">
          Which area of Lyon would you prefer?
        </p>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {locationOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="cursor-pointer flex-1">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
