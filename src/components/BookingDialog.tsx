import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gynecologistId: string;
  gynecologistName: string;
}

export const BookingDialog = ({ 
  open, 
  onOpenChange, 
  gynecologistId, 
  gynecologistName 
}: BookingDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to book appointments");
        return;
      }

      const { error } = await supabase
        .from("appointments")
        .insert({
          patient_id: user.id,
          doctor_id: user.id, // temporary, will be updated by doctor
          gynecologist_id: gynecologistId,
          appointment_date: date.toISOString(),
          notes: notes || null,
          status: "pending"
        });

      if (error) throw error;

      toast.success("Appointment request sent! The doctor will confirm shortly.");
      onOpenChange(false);
      setDate(undefined);
      setNotes("");
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with {gynecologistName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific concerns or questions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isSubmitting || !date}
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
