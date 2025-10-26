import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SpecialConditionsProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export const SpecialConditions = ({ values, onChange }: SpecialConditionsProps) => {
  const conditions = [
    { id: "pcos", label: "PCOS (Polycystic Ovary Syndrome)" },
    { id: "endometriosis", label: "Endometriosis" },
    { id: "fibroids", label: "Uterine fibroids" },
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "High blood pressure" },
    { id: "thyroid", label: "Thyroid conditions" },
    { id: "autoimmune", label: "Autoimmune disorders" },
    { id: "history-cancer", label: "History of cancer" },
    { id: "none", label: "None of the above" },
  ];

  const handleToggle = (conditionId: string) => {
    if (conditionId === "none") {
      onChange(values.includes("none") ? [] : ["none"]);
    } else {
      const newValues = values.includes(conditionId)
        ? values.filter((v) => v !== conditionId)
        : [...values.filter((v) => v !== "none"), conditionId];
      onChange(newValues);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Special Conditions
        </h2>
        <p className="text-muted-foreground text-lg">
          Do you have any of these conditions? (Select all that apply)
        </p>
      </div>

      <div className="space-y-4">
        {conditions.map((condition) => (
          <div
            key={condition.id}
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <Checkbox
              id={condition.id}
              checked={values.includes(condition.id)}
              onCheckedChange={() => handleToggle(condition.id)}
            />
            <Label htmlFor={condition.id} className="flex-1 cursor-pointer text-base font-medium">
              {condition.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
