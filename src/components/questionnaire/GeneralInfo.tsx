import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GeneralInfoProps {
  data: {
    name: string;
    age: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export const GeneralInfo = ({ data, onChange }: GeneralInfoProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Let's Get Started
        </h2>
        <p className="text-muted-foreground text-lg">
          Please share some basic information with us
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium">
            Full Name <span className="text-secondary">*</span>
          </Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter your full name"
            className="mt-2 h-12 text-base"
            required
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-base font-medium">
            Age <span className="text-secondary">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            value={data.age}
            onChange={(e) => onChange("age", e.target.value)}
            placeholder="Enter your age"
            className="mt-2 h-12 text-base"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium">
            Email Address <span className="text-secondary">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="your.email@example.com"
            className="mt-2 h-12 text-base"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number <span className="text-secondary">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className="mt-2 h-12 text-base"
            required
          />
        </div>
      </div>
    </div>
  );
};
